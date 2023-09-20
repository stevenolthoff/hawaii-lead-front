import { IGeoJSONLayerProps } from '@axdspub/axiom-maps'
import TestData from '@/data.json'

type SchoolKey = keyof typeof TestData.bySchool

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
    const fixtures = TestData.bySchool[schoolKey as SchoolKey]
    const fixture = fixtures[0]
    const latitude = Number(fixture.x)
    const longitude = Number(fixture.y)
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [latitude, longitude]
      },
      properties: {}
    }
  }).filter(featureOrNull => featureOrNull !== null)
}
