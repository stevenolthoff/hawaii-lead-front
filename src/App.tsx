import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import DataContextProvider from '@/Contexts/DataContext'
import Map from '@/Pages/Map/Map'
import '@/App.css'
import MapPreviewContextProvider from './Contexts/MapPreviewContext'
import SchoolContextProvider from './Contexts/SchoolContext'

function App () {
  console.log('ENV', process.env)
  return (
    <div className='w-full h-full max-w-full max-h-full absolute'>
      <BrowserRouter basename='/'>
        <DataContextProvider>
          <MapPreviewContextProvider>
            <SchoolContextProvider>
              <Routes>
                <Route
                  path='/schools'
                  element={<Map />}
                />
                <Route
                  path='/schools/:slug'
                  element={<Map />}
                />
                <Route path="*" element={<Navigate to='/schools' replace />} />
              </Routes>
            </SchoolContextProvider>
          </MapPreviewContextProvider>
        </DataContextProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
