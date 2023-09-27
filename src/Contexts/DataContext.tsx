import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import TestData from '@/data.json'

export type Fixtures = typeof TestData.data
export type SchoolKey = keyof typeof TestData.bySchool

type Schools = Record<SchoolKey | string, IFixture[]>
export interface IAPIResponse {
  bySchool: Schools
  data: IFixture[]
}

interface IFixture {
  'school': string
  'district': string
  'island': string
  'job_no.': string
  'first_draw_sample_number': any | null
  'flush_sample_number': any | null
  'sample_point_name': string
  'source_id': string
  'initial_result_ppb': string
  'room_no': string
  'source_type': string
  'ada_compliant?': string
  'date_replacement_scheduled': any | null
  'date_replaced': any | null
  'confirmation_sample_collection_date': any | null
  'date_results_received': any | null
  '': any | null
  'confirmation_result_ppb': any | null
  'flush_result_ppb': any | null
  'released_for_unrestricted_use?': any | null
  'flush_30_seconds_if_used_for_drinking': any | null
  'non-potable_use_only': any | null
  'comments': any | null
  'school_notified': any | null
  'original_fixtures_photo_url': string
  'replaced_fixtures_photo_url': any | null
  'x': string
  'y': string
}

interface IState {
  data: IAPIResponse | null
  filteredSchools: Schools | null
  textFilter: string | null
  districts: string[]
  islands: string[]
  districtFilter: string[]
  islandFilter: string[]
}

const defaultState: IState = {
  data: null,
  filteredSchools: null,
  textFilter: null,
  districts: [],
  islands: [],
  districtFilter: [],
  islandFilter: []
}

interface IDataContext {
  data: IAPIResponse | null
  filteredSchools: Schools | null
  districts: string[]
  islands: string[]
  filterByText: (text: string | undefined) => void
  filterByDistricts: (districts: string[]) => void
  filterByIslands: (islands: string[]) => void
}

const defaultContext: IDataContext = {
  data: null,
  filteredSchools: null,
  districts: [],
  islands: [],
  filterByText: (text: string | undefined) => { console.error('IDataContext.filterByText not implemented.') },
  filterByDistricts: (districts: string[]) => { console.error('IDataContext.filterByDistricts not implemented.') },
  filterByIslands: (islands: string[]) => { console.error('IDataContext.filterByIslands not implemented.') }
}

const DataContext = createContext<IDataContext>(defaultContext)

const delay = async (delay = 1000, callback: () => any) => {        
  const delayPromise = (ms: number) => new Promise(res => setTimeout(res, ms))
  await delayPromise(delay)
  return callback()
}

export default function DataContextProvider ({ children }: PropsWithChildren) {
  const [data, setData] = useState<IAPIResponse | null>(defaultState.data)
  const [filteredSchools, setFilteredSchools] = useState(defaultState.filteredSchools)
  const [textFilter, setTextFilter] = useState(defaultState.textFilter)
  const [districts, setDistricts] = useState(defaultState.districts)
  const [islands, setIslands] = useState(defaultState.islands)
  const [districtFilter, setDistrictFilter] = useState(defaultState.districtFilter)
  const [islandFilter, setIslandFilter] = useState(defaultState.islandFilter)

  const fetchData = () => delay(750, async () => TestData)

  useEffect(() => {
    fetchData()
      .then(data => setData(data))
      .catch(error => console.error(error))
  }, [])

  useEffect(() => {
    if (data === null) return
    setFilteredSchools(data.bySchool)
    setDistrictsFromData(data)
    setIslandsFromData(data)
  }, [data])

  useEffect(() => {
    if (data === null) return
    const filteredSchools = Object.keys(data.bySchool)
      .filter((school: string) => textFilterPredicate(school))
      .filter((school: string) => districtFilterPredicate(school))
      .filter((school: string) => islandFilterPredicate(school))
      .reduce((record, key) => ( record[key] = data.bySchool[key], record ), {} as Schools)
    setFilteredSchools(filteredSchools)
  }, [textFilter, districtFilter, islandFilter])

  function textFilterPredicate (school: string): boolean {
    if (data === null) return false
    if (textFilter === null) return true
    return schoolMatchesTextSearch(getCleanTextFilter(textFilter), data.bySchool[school][0])
  }

  function districtFilterPredicate (school: string): boolean {
    if (data === null) return false
    if (districtFilter.length === 0) return true
    return districtFilter.find(district => district === data.bySchool[school][0].district) !== undefined
  }

  function islandFilterPredicate (school: string): boolean {
    if (data === null) return false
    if (islandFilter.length === 0) return true
    return islandFilter.find(island => island === data.bySchool[school][0].island) !== undefined
  }

  function setDistrictsFromData (data: IAPIResponse) {
    setDistricts(_.uniqBy(data.data, 'district').map(fixture => fixture.district))
  }

  function setIslandsFromData (data: IAPIResponse) {
    setIslands(_.uniqBy(data.data, 'island').map(fixture => fixture.island))
  }

  function filterByText (text: string | undefined) {
    setTextFilter(text === undefined ? null : text)
  }

  function filterByDistricts (districts: string[]) {
    setDistrictFilter(districts)
  }

  function filterByIslands (islands: string[]) {
    setIslandFilter(islands)
  }

  function getCleanTextFilter (text: string) {
    return text.trim().toLowerCase()
  }

  function schoolMatchesTextSearch (text: string, fixture: IFixture) {
    return fixture.school.toLowerCase().includes(text) ||
      fixture.district.toLowerCase().includes(text) ||
      fixture.island.toLowerCase().includes(text)
  }

  return (
    <DataContext.Provider
      value={{
        data,
        filteredSchools,
        districts,
        islands,
        filterByText,
        filterByDistricts,
        filterByIslands
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useDataContext () {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataContextProvider')
  } return context
}
