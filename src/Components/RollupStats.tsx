import React from 'react'
import { useDataContext } from '@/Contexts/DataContext'
import { Loader } from '@axdspub/axiom-ui-utilities'

const RollupStats = () => {
  const { filteredSchools } = useDataContext()
  if (filteredSchools === null) {
    return <Loader />
  } else {
    return (
      <div>
        Count: { Object.keys(filteredSchools).length }
      </div>
    )
  }
}
 
export default RollupStats
