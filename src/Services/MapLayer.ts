import { IGeoJSONLayerProps } from '@axdspub/axiom-maps'
import { IAPIResponse, Fixtures, SchoolKey, ProgressStatus } from '@/Contexts/DataContext'
import { getColorForStatus } from './SchoolStatus'
export interface ISchool {
  school: SchoolKey
  fixtures: Fixtures
}

export default function getLayer (schools: IAPIResponse['bySchool']): IGeoJSONLayerProps {
  const layer: IGeoJSONLayerProps = {
    id: 'geoJson',
    type: 'geoJson',
    label: 'geoJson',
    zIndex: 20,
    isBaseLayer: false,
    options: {
      geoJson: parseAsGeoJSON(schools)
    }
  }
  return layer
}

function parseAsGeoJSON (schools: IAPIResponse['bySchool']): any {
  const schoolKeys = Object.keys(schools)
  return schoolKeys.map(schoolKey => {
    const school = schoolKey as SchoolKey
    const fixtures = schools[school]
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
        fillOpacity: 0.8,
        weight: 1,
        color: 'black',
        data
      }
    }
  }).filter(featureOrNull => featureOrNull !== null)
}

function getColor(fixtures: Fixtures) {
  return getColorForStatus(getProgress(fixtures))
}

/**
 * 
 * Complete: All fixtures.released_for_unrestricted_use == true
 * In Progress: ≥1 fixture.date_replaced != null AND not all fixtures.released_for_unrestricted_use == true
 * Not Started: 0 fixtures.date_replaced != null
 */
export function getProgress(fixtures: Fixtures): ProgressStatus {
  let notStarted = true
  let completedFixtures = 0
  for (let i = 0; i < fixtures.length; i += 1) {
    const fixture = fixtures[i]
    if (notStarted && fixture.date_replaced !== null) {
      notStarted = false
    } else if (!notStarted && fixture['released_for_unrestricted_use?'] !== 'Yes') {
      return 'In Progress'
    }
    if (fixture['released_for_unrestricted_use?'] === 'Yes') {
      completedFixtures += 1
    }
  }
  if (completedFixtures === fixtures.length) {
    return 'Completed'
  } else {
    return 'Not Started'
  }
}
