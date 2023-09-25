import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
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
}

const defaultState: IState = {
  data: null,
  filteredSchools: null,
  textFilter: null
}

interface IDataContext {
  data: IAPIResponse | null
  filteredSchools: Schools | null
  filterByText: (text: string | undefined) => void
}

const defaultContext: IDataContext = {
  data: null,
  filteredSchools: null,
  filterByText: (text: string | undefined) => { console.error('IDataContext.filterByText not implemented.') }
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

  const fetchData = () => delay(750, async () => TestData)

  useEffect(() => {
    fetchData()
      .then(data => setData(data))
      .catch(error => console.error(error))
  }, [])

  useEffect(() => {
    if (data === null) return
    setFilteredSchools(data.bySchool)
  }, [data])

  useEffect(() => {
    if (data === null) {
      return
    }
    if (textFilter === null) {
      setFilteredSchools(data.bySchool)
    } else {
      const cleanTextFilter = textFilter.trim().toLowerCase()
      const results: Schools = Object.keys(data.bySchool)
        .filter(school => schoolMatchesTextSearch(cleanTextFilter, data.bySchool[school][0]))
        .reduce((record, key) => ( record[key] = data.bySchool[key], record ), {} as Schools)
      setFilteredSchools(results)
    }
  }, [textFilter])

  function filterByText (text: string | undefined) {
    setTextFilter(text === undefined ? null : text)
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
        filterByText
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
