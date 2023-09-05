import React from 'react'
import Map from '@/Pages/Map/Map'
import '@/App.css'

function App () {
  console.log('ENV', process.env)
  return (
    <div className='w-screen h-screen'>
      <Map></Map>
    </div>
  )
}

export default App
