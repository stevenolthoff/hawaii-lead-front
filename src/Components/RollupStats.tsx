import React, { useEffect, useState } from 'react'
import { ProgressStatus, useDataContext } from '@/Contexts/DataContext'
import { Loader } from '@axdspub/axiom-ui-utilities'
import { getStats } from '@/Services/RollupStats'
import { getNumCompleteFixtures, getNumInProgressFixtures } from '@/Services/SchoolStatus'
import { IFixture } from '@/Contexts/DataContext'

const RollupStats = () => {
  const { filteredSchools } = useDataContext()
  const [stats, setStats] = useState<Record<ProgressStatus, number> | null>(null)
  const [allFixtures, setAllFixtures] = useState<IFixture[]>([])
  const [totalNotStarted, setTotalNotStarted] = useState(0)
  const [totalInProgress, setTotalInProgress] = useState(0)
  const [totalComplete, setTotalComplete] = useState(0)

  const getSchoolCount = () => {
    if (filteredSchools === null) return ''
    const count = Object.keys(filteredSchools).length
    if (count === 1) return `${count} School`
    return `${count} Schools`
  }

  const getTotalCompleteFixtures = () => {
    if (filteredSchools === null) return 0
    return getNumCompleteFixtures(allFixtures)
  }

  const getTotalInProgressFixtures = () => {
    if (filteredSchools === null) return 0
    return getNumInProgressFixtures(allFixtures)
  }

  useEffect(() => {
    if (filteredSchools === null) return
    setStats(getStats(filteredSchools))
    console.log(filteredSchools)
    setAllFixtures(Object.values(filteredSchools ?? []).flat())
  }, [filteredSchools])

  useEffect(() => {
    const complete = getTotalCompleteFixtures()
    const inProgress = getTotalInProgressFixtures()
    setTotalComplete(complete)
    setTotalInProgress(inProgress)
    setTotalNotStarted(allFixtures.length - complete - inProgress)
  }, [allFixtures])
  
  if (filteredSchools === null || stats === null) {
    return <></>
  } else {
    return (
      <div>
        <p className='font-semibold text-lg'>{getSchoolCount()}</p>
        <p>School Report</p>
        <div className='flex justify-between'>
          <p>Not Started: { stats['Not Started'] } schools</p>
          <p>In Progress: { stats['In Progress'] } schools</p>
          <p>Completed: { stats['Completed'] } schools</p>
        </div>
        <p>Fixture Report</p>
        <div>
          <p>Total Not Started: {totalNotStarted}</p>
          <p>Total In Progress: {totalInProgress}</p>
          <p>Total Complete: {totalComplete}</p>
        </div>
      </div>
    )
  }
}
 
export default RollupStats
