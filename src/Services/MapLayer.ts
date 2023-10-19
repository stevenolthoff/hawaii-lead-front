import { IGeoJSONLayerProps } from '@axdspub/axiom-maps'
import { IAPIResponse, SchoolKey, ProgressStatus, IFixture } from '@/Contexts/DataContext'
import { getColorForStatus } from './SchoolStatus'
export interface ISchool {
  id: string
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
    const id = findJobId(fixtures)
    if (id === 'no-id') return null
    const coordinates = findCoordinates(fixtures)
    const latitude = coordinates === null ? null : coordinates[0]
    const longitude = coordinates === null ? null : coordinates[1]
    const data: ISchool = {
      id,
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

export function findJobId (fixtures: IFixture[]): string {
  const fixture = fixtures.find(fixture => fixture.job_number !== null && fixture.job_number !== '')
  if (fixture === undefined) return 'no-id'
  return fixture.job_number
}

export function findCoordinates (fixtures: IFixture[]): [number, number] | null {
  const fixture = fixtures.find(fixture => fixture.geometry !== null)
  if (fixture === undefined) return null
  return fixture.geometry.coordinates
}

function getColor(fixtures: IFixture[]) {
  return getColorForStatus(getProgress(fixtures))
}

/**
 * 
 * Complete: All fixtures.released_for_unrestricted_use == true
 * In Progress: ≥1 fixture.date_replaced != null AND not all fixtures.released_for_unrestricted_use == true
 * Not Started: 0 fixtures.date_replaced != null
 */
export function getProgress(fixtures: IFixture[]): ProgressStatus {
  // if (fixtures[0].school === 'Waihee Elementary') debugger
  let notStarted = true
  let completedFixtures = 0
  for (let i = 0; i < fixtures.length; i += 1) {
    const fixture = fixtures[i]
    if (notStarted && fixture.date_replaced !== null) {
      notStarted = false
    } else if (!notStarted && fixture.fixture_status === null) {
      return 'In Progress'
    }
    if (fixture.fixture_status === 'flush_for_drinking' || fixture.fixture_status === 'unrestricted') {
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
