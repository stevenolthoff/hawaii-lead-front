import React from 'react'
import DataContextProvider from '@/Contexts/DataContext'
import Map from '@/Pages/Map/Map'
import '@/App.css'
import MapPreviewContextProvider from './Contexts/MapPreviewContext'
import SchoolContextProvider from './Contexts/SchoolContext'

function App () {
  console.log('ENV', process.env)
  return (
    <div className='w-full h-full max-w-full max-h-full absolute'>
      <DataContextProvider>
        <MapPreviewContextProvider>
          <SchoolContextProvider>
            <Map />
          </SchoolContextProvider>
        </MapPreviewContextProvider>
      </DataContextProvider>
    </div>
  )
}

export default App
