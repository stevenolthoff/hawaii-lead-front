import React from 'react'
import SchoolList from '@/Components/SchoolList'
import RollupStats from '@/Components/RollupStats'

const MapSidebar = () => {
  return (
    <div className='max-h-full overflow-y-scroll'>
      <div className=''>
        <RollupStats />
      </div>
      <div className=''>
        <SchoolList />
      </div>
    </div>
  )
}
 
export default MapSidebar
