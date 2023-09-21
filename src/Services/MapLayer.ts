import { IGeoJSONLayerProps } from '@axdspub/axiom-maps'
import TestData from '@/data.json'

type SchoolKey = keyof typeof TestData.bySchool

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
        fillColor: 'orange',
        data
      }
    }
  }).filter(featureOrNull => featureOrNull !== null)
}
