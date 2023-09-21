import { IGeoJSONLayerProps } from '@axdspub/axiom-maps'
import TestData from '@/data.json'

type SchoolKey = keyof typeof TestData.bySchool
type Progress = 'not-started' | 'in-progress' | 'complete'
export interface ISchool {
  school: SchoolKey
  fixtures: typeof TestData.data
}


export default function getLayer (): IGeoJSONLayerProps {
  const layer: IGeoJSONLayerProps = {
    id: 'geoJson',
    type: 'geoJson',
    label: 'geoJson',
    zIndex: 20,
    isBaseLayer: false,
    options: {
      geoJson: parseAsGeoJSON()
    }
  }
  return layer
}

function parseAsGeoJSON (): any {
  const schoolKeys = Object.keys(TestData.bySchool)
  return schoolKeys.map(schoolKey => {
    const school = schoolKey as SchoolKey
    const fixtures = TestData.bySchool[school]
    const fixture = fixtures[0]
    const latitude = Number(fixture.x)
    const longitude = Number(fixture.y)
    const data: ISchool = {
      school,
      fixtures
    }
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [latitude, longitude]
      },
      properties: {
        'point-radius': 8,
        fillColor: getColor(fixtures),
        data
      }
    }
  }).filter(featureOrNull => featureOrNull !== null)
}

function getColor(fixtures: typeof TestData.data) {
  const progress = getProgress(fixtures)
  if (progress === 'not-started') {
    return 'red'
  } else if (progress === 'in-progress') {
    return 'yellow'
  } else if (progress === 'complete') {
    return 'green'
  } else {
    return 'blue'
  }
}

/**
 * 
 * Complete: All fixtures.released_for_unrestricted_use == true
 * In Progress: ≥1 fixture.date_replaced != null AND not all fixtures.released_for_unrestricted_use == true
 * Not Started: 0 fixtures.date_replaced != null
 */
function getProgress(fixtures: typeof TestData.data): Progress {
  let notStarted = true
  let completedFixtures = 0
  for (let i = 0; i < fixtures.length; i += 1) {
    const fixture = fixtures[i]
    if (notStarted && fixture.date_replaced !== null) {
      notStarted = false
    } else if (!notStarted && fixture['released_for_unrestricted_use?'] !== 'Yes') {
      return 'in-progress'
    }
    if (fixture['released_for_unrestricted_use?'] === 'Yes') {
      completedFixtures += 1
    }
  }
  if (completedFixtures === fixtures.length) {
    return 'complete'
  } else {
    return 'not-started'
  }
}
