import { IGeoJSONLayerProps } from '@axdspub/axiom-maps'
import { IAPIResponse, Fixtures, SchoolKey, ProgressStatus, IFixture } from '@/Contexts/DataContext'
import { getColorForStatus } from './SchoolStatus'
export interface ISchool {
  school: SchoolKey
  fixtures: IFixture[]
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
    const coordinates = findCoordinates(fixtures)
    const latitude = coordinates === null ? null : coordinates[0]
    const longitude = coordinates === null ? null : coordinates[1]
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

function findCoordinates (fixtures: IFixture[]): [number, number] | null {
  const fixture = fixtures.find(fixture => fixture.x !== null && fixture.y !== null)
  if (fixture === undefined) return null
  return [Number(fixture.x), Number(fixture.y)]
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
  // if (fixtures[0].school === 'Waihee Elementary') debugger
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
  } else if (completedFixtures > 0) {
    return 'In Progress'
  } else {
    return 'Not Started'
  }
}
