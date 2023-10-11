import React, { PropsWithChildren, createContext, useContext, useState } from 'react'
import { useDataContext } from '@/Contexts/DataContext'
import { ISchool, findJobId } from '@/Services/MapLayer'

interface IState {
  selectedSchool: ISchool | null
}

const defaultState: IState = {
  selectedSchool: null
}

interface ISchoolContext {
  selectedSchool: ISchool | null
  selectSchool: (schoolId: string | null) => void
}

const defaultContext: ISchoolContext = {
  selectedSchool: null,
  selectSchool: (schoolId: string | null) => { console.error('ISchoolContext.setSchool not implemented.') }
}

const SchoolContext = createContext<ISchoolContext>(defaultContext)

export default function SchoolContextProvider ({ children }: PropsWithChildren) {
  const { data } = useDataContext()
  const [selectedSchool, setSelectedSchool] = useState<ISchool | null>(defaultState.selectedSchool)
  function selectSchool (schoolId: string | null) {
    if (schoolId === null) {
      setSelectedSchool(null)
    } else {
      const fixtures = data?.byJobId[schoolId]
      if (fixtures === undefined) {
        setSelectedSchool(null)
      } else {
        const school: ISchool = { id: findJobId(fixtures), school: fixtures[0].school, fixtures }
        setSelectedSchool(school)
      }
    }
  }
  return (
    <SchoolContext.Provider
      value={{
        selectedSchool,
        selectSchool
      }}
    >
      {children}
    </SchoolContext.Provider>
  )
}

export function useSchoolContext () {
  const context = useContext(SchoolContext)
  if (context === undefined) {
    throw new Error('useSchoolContext must be used within a SchoolContextProvider')
  } return context
}
