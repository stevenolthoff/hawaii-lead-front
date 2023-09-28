import React, { PropsWithChildren, createContext, useContext, useState } from 'react'

interface IState {
  school: string | null
}

const defaultState: IState = {
  school: null
}

interface IMapPreviewContext {
  school: string | null
  setSchoolToPreview: (school: string | null) => void
}

const defaultContext: IMapPreviewContext = {
  school: null,
  setSchoolToPreview: (school: string | null) => { console.error('IMapPreviewContext.setSchool not implemented.') }
}

const MapPreviewContext = createContext<IMapPreviewContext>(defaultContext)

export default function MapPreviewContextProvider ({ children }: PropsWithChildren) {
  const [school, setSchool] = useState<string | null>(defaultState.school)
  function setSchoolToPreview (school: string | null) {
    setSchool(school)
  }
  return (
    <MapPreviewContext.Provider
      value={{
        school,
        setSchoolToPreview
      }}
    >
      {children}
    </MapPreviewContext.Provider>
  )
}

export function useMapPreviewContext () {
  const context = useContext(MapPreviewContext)
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataContextProvider')
  } return context
}
