import React, { useEffect, useState } from 'react'
import { ProgressStatus, useDataContext } from '@/Contexts/DataContext'
import { Loader } from '@axdspub/axiom-ui-utilities'
import { getStats } from '@/Services/RollupStats'

const RollupStats = () => {
  const { filteredSchools } = useDataContext()
  const [stats, setStats] = useState<Record<ProgressStatus, number> | null>(null)

  useEffect(() => {
    if (filteredSchools === null) return
    setStats(getStats(filteredSchools))
  }, [filteredSchools])
  
  if (filteredSchools === null || stats === null) {
    return <Loader />
  } else {
    return (
      <div>
        <p>Count: { Object.keys(filteredSchools).length }</p>
        <p>Not Started: { stats['Not Started'] }</p>
        <p>In Progress: { stats['In Progress'] }</p>
        <p>Completed: { stats['Completed'] }</p>
      </div>
    )
  }
}
 
export default RollupStats
