import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import TestData from '@/data.json'
import { getProgress } from '@/Services/MapLayer'

export type Fixtures = typeof TestData.data
export type SchoolKey = keyof typeof TestData.bySchool
export type ProgressStatus = 'Not Started' | 'In Progress' | 'Completed'

export type Schools = Record<SchoolKey | string, IFixture[]>
export interface IAPIResponse {
  bySchool: Schools
  data: IFixture[]
}

export interface IFixture {
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
  [key: string]: any
}

interface IState {
  data: IAPIResponse | null
  filteredSchools: Schools | null
  textFilter: string | null
  districts: string[]
  schoolFilter: string | null
  islands: string[]
  schools: string[]
  districtFilter: string[]
  islandFilter: string[]
  statusFilter: ProgressStatus[]
}

const defaultState: IState = {
  data: null,
  filteredSchools: null,
  textFilter: null,
  districts: [],
  islands: [],
  schools: [],
  districtFilter: [],
  islandFilter: [],
  schoolFilter: null,
  statusFilter: []
}

interface IDataContext {
  data: IAPIResponse | null
  filteredSchools: Schools | null
  districts: string[]
  islands: string[]
  schools: string[]
  filterByText: (text: string | undefined) => void
  filterByDistricts: (districts: string[]) => void
  filterByIslands: (islands: string[]) => void
  filterBySchool: (school: string | null) => void
  filterByStatus: (statuses: ProgressStatus[]) => void
}

const defaultContext: IDataContext = {
  data: null,
  filteredSchools: null,
  districts: [],
  islands: [],
  schools: [],
  filterByText: (text: string | undefined) => { console.error('IDataContext.filterByText not implemented.') },
  filterByDistricts: (districts: string[]) => { console.error('IDataContext.filterByDistricts not implemented.') },
  filterByIslands: (islands: string[]) => { console.error('IDataContext.filterByIslands not implemented.') },
  filterBySchool: (school: string | null) => { console.error('IDataContext.filterBySchool not implemented.') },
  filterByStatus: (statuses: ProgressStatus[]) => { console.error('IDataContext.filterByStatus not implemented.') }
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
  const [schools, setSchools] = useState(defaultState.schools)
  const [districtFilter, setDistrictFilter] = useState(defaultState.districtFilter)
  const [islandFilter, setIslandFilter] = useState(defaultState.islandFilter)
  const [schoolFilter, setSchoolFilter] = useState(defaultState.schoolFilter)
  const [statusFilter, setStatusFilter] = useState(defaultState.statusFilter)

  const fetchData = () => delay(750, async () => TestData)

  useEffect(() => {
    fetchData()
      .then(data => setData(data))
      .catch(error => console.error(error))
  }, [])

  useEffect(() => {
    if (data === null) return
    setFilteredSchools(data.bySchool)
    setSchoolsFromData(data)
    setDistrictsFromData(data)
    setIslandsFromData(data)
  }, [data])

  useEffect(() => {
    if (data === null) return
    const filteredSchools = Object.keys(data.bySchool)
      .filter((school: string) => schoolFilterPredicate(school))
      .filter((school: string) => districtFilterPredicate(school))
      .filter((school: string) => islandFilterPredicate(school))
      .filter((school: string) => statusFilterPredicate(school))
      .reduce((record, key) => ( record[key] = data.bySchool[key], record ), {} as Schools)
    setFilteredSchools(filteredSchools)
  }, [textFilter, schoolFilter, districtFilter, islandFilter, statusFilter])

  function schoolFilterPredicate (school: string): boolean {
    if (data === null) return false
    if (schoolFilter === null) return true
    return school === schoolFilter
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

  function statusFilterPredicate (school: string): boolean {
    if (data === null) return false
    if (statusFilter.length === 0) return true
    const schoolStatus = getSchoolStatus(school)
    return statusFilter.find(status => status === schoolStatus) !== undefined
  }

  function setDistrictsFromData (data: IAPIResponse) {
    setDistricts(_.uniqBy(data.data, 'district').map(fixture => fixture.district))
  }

  function setSchoolsFromData (data: IAPIResponse) {
    setSchools(Object.keys(data.bySchool))
  }

  function setIslandsFromData (data: IAPIResponse) {
    setIslands(_.uniqBy(data.data, 'island').map(fixture => fixture.island))
  }

  function filterByText (text: string | undefined) {
    setTextFilter(text === undefined ? null : text)
  }

  function filterBySchool (school: string | null) {
    setSchoolFilter(school === '' ? null : school)
  }

  function filterByDistricts (districts: string[]) {
    setDistrictFilter(districts)
  }

  function filterByIslands (islands: string[]) {
    setIslandFilter(islands)
  }

  function filterByStatus (statuses: ProgressStatus[]) {
    setStatusFilter(statuses)
  }

  function getSchoolStatus (school: string): ProgressStatus {
    if (data === null) return 'Not Started'
    return getProgress(data.bySchool[school])
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
        schools,
        filterByText,
        filterBySchool,
        filterByDistricts,
        filterByIslands,
        filterByStatus
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
