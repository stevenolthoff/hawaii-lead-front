import axios from 'axios'
import { IAPIResponse, IFixture } from '@/Contexts/DataContext'
import _ from 'lodash'

interface Feature {
  'type': 'Feature'
  'id': string
  'geometry': {
      'type': 'Point',
      'coordinates': [number, number]
  },
  'properties': {
    'ada_compliant': string | null
    'comments': string | null
    'confirmation_sample_collection_date': string | null
    'date_replaced': string | null
    'date_replacement_scheduled': string | null
    'date_results_received': string | null
    'date_school_notified': string | null
    'district': string
    'first_draw_sample_number': string | null
    'fixture_status': 'flush_for_drinking' | 'unrestricted' | 'non_potable' | null
    'flush_sample_number': string | null
    'island': string
    'job_number': string
    'lead_ppb_confirmation': number | null
    'lead_ppb_flush': number | null
    'lead_ppb_initial': number | null
    'original_fixtures_photo_url': string | null
    'replaced_fixtures_photo_url': string | null
    'room_number': string | null
    'sample_point_name': string | null
    'school': string
    'source_id': string
    'source_type': string
  }
}

export default class API {
  static PROD_URL = 'https://hlww-features.srv.axds.co/collections/public.fixtures/items'
  static DEV_URL = 'https://stage-hlww-features.srv.axds.co/collections/public.fixtures/items'
  static API_URL = process.env.NODE_ENV === 'production' ? this.PROD_URL : this.DEV_URL
  public static async getFeatures () {
    console.log('env', process.env.NODE_ENV)
    const limit = 1000
    let offset = 0
    const features: Feature[] = []
    let hasMore = true
    while (hasMore) {
      const response = await axios.get(this.API_URL, {
        params: {
          limit,
          offset
        }
      })
      features.push(...response.data.features)
      hasMore = response.data.numberReturned === limit
      offset += limit
    }
    return features
  }

  public static async getParsedFeatures (): Promise<IAPIResponse | undefined> {
    let features: Feature[] = []
    try {
      features = await this.getFeatures()
    } catch (error) {
      console.error(error)
      return
    }
    console.log(features)

    const groupedByJobId = _.groupBy(features, feature => feature.properties.job_number)
    const byJobId: Record<string, any> = {}
    Object.keys(groupedByJobId).forEach(jobId => {
      const featureArray = groupedByJobId[jobId]
      byJobId[jobId] = _.map(featureArray, feature => {
        const { properties, ...allOtherProps } = feature
        return {
          ...feature.properties,
          ...allOtherProps
        }
      })
    })

    const groupedBySchool = _.groupBy(features, feature => feature.properties.school)
    const bySchool: Record<string, any> = {}
    Object.keys(groupedBySchool).forEach(school => {
      const featureArray = groupedBySchool[school]
      bySchool[school] = _.map(featureArray, feature => {
        const { properties, ...allOtherProps } = feature
        return {
          ...feature.properties,
          ...allOtherProps
        }
      })
    })

    const data: IFixture[] = features.map(feature => {
      const { properties, ...allOtherProps } = feature
      return {
        ...feature.properties,
        ...allOtherProps
      }
    })

    console.log(byJobId)
    console.log(bySchool)

    const parsed: IAPIResponse = {
      byJobId,
      bySchool,
      data
    }
    return parsed
  }
}
