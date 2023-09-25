import TestData from '@/data.json'

export type Fixtures = typeof TestData.data
export type SchoolKey = keyof typeof TestData.bySchool

/** Mock API */
export default class API {
  public static getSchools () {
    return TestData.bySchool
  }
}
