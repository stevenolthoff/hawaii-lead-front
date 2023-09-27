import React from 'react'
import SchoolList from '@/Components/SchoolList'
import RollupStats from '@/Components/RollupStats'

const MapSidebar = () => {
  return (
    <div className='max-h-full h-full overflow-y-scroll px-4 py-2 text-sm shadow-xl scrollbox'>
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
