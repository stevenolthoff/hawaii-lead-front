import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import TestData from '@/data.json'

export type Fixtures = typeof TestData.data
export type SchoolKey = keyof typeof TestData.bySchool
export type APIData = typeof TestData

interface IState {
  loading: boolean
  data: APIData | null
}

const defaultState: IState = {
  loading: true,
  data: null
}

export const DataContext = createContext(defaultState)

const delay = async (delay = 1000, callback: () => any) => {        
  const delayPromise = (ms: number) => new Promise(res => setTimeout(res, ms))
  await delayPromise(delay)
  return callback()
}

export default function DataContextProvider ({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<APIData | null>(null)

  // const fetchData = async () => TestData
  const fetchData = () => delay(750, async () => TestData)

  useEffect(() => {
    fetchData()
      .then(data => setData(data))
      .catch(error => console.error(error))
  }, [])

  useEffect(() => setLoading(data === null), [data])

  return (
    <DataContext.Provider
      value={{
        loading,
        data
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useDataContext () {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a DataContextProvider')
  } return context
}
