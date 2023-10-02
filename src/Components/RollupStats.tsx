/**
 * clean this whole thing up
 */

import React, { useEffect, useState, useRef } from 'react'
import { ProgressStatus, useDataContext } from '@/Contexts/DataContext'
import { getStats } from '@/Services/RollupStats'
import { getNumCompleteFixtures, getNumInProgressFixtures } from '@/Services/SchoolStatus'
import { IFixture } from '@/Contexts/DataContext'
import StackedBarChart from '@/Components/StackedBarChart'
import BubbleLegend from '@/Components/BubbleLegend'

const RollupStats = () => {
  const { filteredSchools } = useDataContext()
  const containerRef = useRef<HTMLDivElement>(null)
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

  const getFixtureCount = () => {
    if (allFixtures === null) return ''
    const count = Object.keys(allFixtures).length
    if (count === 1) return `${count} Fixture`
    return `${count} Fixtures`
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
    console.log('allFixtures changed')
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
      <div ref={containerRef}>
        <div className='flex flex-col gap-2'>
          <p className='font-semibold text-lg'>{getSchoolCount()}</p>
          <BubbleLegend />
          <div>
            <p className='font-semibold text-slate-800'>School Summary</p>
            <p className='text-xs text-slate-500'>Fixture replacement status by school</p>
            <StackedBarChart
              id='stacked-bar-chart-school-summary'
              width={containerRef?.current?.clientWidth}
              notStarted={stats['Not Started']}
              inProgress={stats['In Progress']}
              complete={stats['Completed']}
            />
          </div>
          <div>
            <p className='font-semibold text-lg'>{getFixtureCount()} </p>
            <p className='font-semibold text-slate-800'>Fixture Summary</p>
            <p className='text-xs text-slate-500'>Overall fixture replacements</p>
            <StackedBarChart
              id='stacked-bar-chart-fixture-summary'
              width={containerRef?.current?.clientWidth}
              notStarted={totalNotStarted}
              inProgress={totalInProgress}
              complete={totalComplete}
            />
          </div>
        </div>
      </div>
    )
  }
}
 
export default RollupStats
