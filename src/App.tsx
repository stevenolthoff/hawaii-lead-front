import React from 'react'
import DataContextProvider from '@/Contexts/DataContext'
import Map from '@/Pages/Map/Map'
import '@/App.css'

function App () {
  console.log('ENV', process.env)
  return (
    <div className='w-full h-full max-w-full max-h-full absolute'>
      <DataContextProvider>
        <Map />
      </DataContextProvider>
    </div>
  )
}

export default App
