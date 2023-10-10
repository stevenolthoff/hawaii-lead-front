import React, { PropsWithChildren, createContext, useContext, useState } from 'react'
import { ISchool } from '@/Services/MapLayer'

interface IState {
  school: ISchool | null
  coordinates: [number, number] | null
  screenCoordinates: [number, number] | null
}

const defaultState: IState = {
  school: null,
  coordinates: null,
  screenCoordinates: null
}

interface IMapPreviewContext {
  school: ISchool | null
  coordinates: [number, number] | null
  screenCoordinates: [number, number] | null
  setSchoolToPreview: (school: ISchool | null) => void
  setPreviewCoordinates: (coordinates: [number, number] | null) => void
  setScreenCoordinates: (coordinates: [number, number] | null) => void
}

const defaultContext: IMapPreviewContext = {
  school: null,
  coordinates: null,
  screenCoordinates: null,
  setSchoolToPreview: (school: ISchool | null) => { console.error('IMapPreviewContext.setSchool not implemented.') },
  setPreviewCoordinates: (coordinates: [number, number] | null) => { console.error('IMapPreviewContext.setPreviewCoordinates not implemented.') },
  setScreenCoordinates: (coordinates: [number, number] | null) => { console.error('IMapPreviewContext.setScreenCoordinates not implemented.') }
}

const MapPreviewContext = createContext<IMapPreviewContext>(defaultContext)

export default function MapPreviewContextProvider ({ children }: PropsWithChildren) {
  const [school, setSchool] = useState<ISchool | null>(defaultState.school)
  const [coordinates, setCoordinates] = useState<[number, number] | null>(defaultState.coordinates)
  const [screenCoordinates, setScreenCoordinatesState] = useState<[number, number] | null>(defaultState.screenCoordinates)
  function setSchoolToPreview (school: ISchool | null) {
    setSchool(school)
  }
  function setPreviewCoordinates (coordinates: [number, number] | null) {
    setCoordinates(coordinates)
  }
  function setScreenCoordinates (coordinates: [number, number] | null) {
    setScreenCoordinatesState(coordinates)
  }
  return (
    <MapPreviewContext.Provider
      value={{
        school,
        coordinates,
        screenCoordinates,
        setSchoolToPreview,
        setPreviewCoordinates,
        setScreenCoordinates
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
