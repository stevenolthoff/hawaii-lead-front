import React, { useEffect, useState, ReactElement, useRef } from 'react'
import { ProgressStatus, useDataContext } from '@/Contexts/DataContext'
import { Loader } from '@axdspub/axiom-ui-utilities'
import { getStats } from '@/Services/RollupStats'
import { getNumCompleteFixtures, getNumInProgressFixtures } from '@/Services/SchoolStatus'
import { IFixture } from '@/Contexts/DataContext'
import * as d3 from 'd3'
import StatusBubble from './StatusBubble'

interface IStackedBarChartProps {
  id: string
  notStarted: number
  inProgress: number
  complete: number
  containerPxWidth: number | undefined
}

const StackedBarChart = ({ id, notStarted, inProgress, complete, containerPxWidth }: IStackedBarChartProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null)
  const drawChart = () => {
    console.log('draw chart', id, notStarted)
    if (containerPxWidth === undefined) return
    const chart = d3.select(`#stacked-bar-chart-${id}`).selectChild('svg')
    try {
      chart.remove()
    } catch (error) {
      console.error('none to remove')
    }
    console.log('container width:', containerPxWidth)

    const data = [
      {
        label: 'Not Started',
        value: notStarted,
        color: '#ef4444'
      },
      {
        label: 'In Progress',
        value: inProgress,
        color: '#eab308'
      },
      {
        label: 'Completed',
        value: complete,
        color: '#22c55e'
      }
    ]
    const height = 100
    const barHeight = 50
    const halfBarHeight = barHeight / 2
    const f = d3.format('.1f')
    const margin = {
      top: 12,
      right: 2,
      bottom: 0,
      left: 2
    }
    const width = containerPxWidth ?? 200
    const w = width - margin.left - margin.right
    const h = height * 0.66
    // const colors = ['#ef4444', '#eab308', '#22c55e']

    const total = d3.sum(data, d => d.value)
    console.info('total', total)

    function groupDataFunc(data: any): { cumulative: number, label: string, percent: number, value: number, color: string }[] {
      // use a scale to get percentage values
      const percent = d3.scaleLinear()
        .domain([0, total])
        .range([0, 100])
      // filter out data that has zero values
      // also get mapping for next placement
      // (save having to format data for d3 stack)
      let cumulative = 0
      const _data = data.map((d: any) => {
        cumulative += d.value
        return {
          value: d.value,
          // want the cumulative to prior value (start of rect)
          cumulative: cumulative - d.value,
          label: d.label,
          percent: percent(d.value),
          color: d.color
        }
      }).filter((d: any) => d.value > 0)
      return _data
    }

    const groupData = groupDataFunc(data)
    console.info('groupData', groupData)

    const sel = d3.select(ref.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)


    // set up scales for horizontal placement
    const xScale = d3.scaleLinear()
      .domain([0, total])
      .range([0, w])

    const join = sel.selectAll('g')
      .data(groupData)
      .join('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // stack rect for each data value
    join.append('rect')
      .attr('class', 'rect-stacked')
      .attr('x', d => xScale(d.cumulative))
      .attr('y', h / 2 - halfBarHeight)
      .attr('height', barHeight)
      .attr('width', d => xScale(d.value))
      .style('fill', (d, i) => d.color)

    // add values on bar
    join.append('text')
      .attr('class', 'text-value')
      .attr('text-anchor', 'middle')
      .attr('x', d => xScale(d.cumulative) + (xScale(d.value) / 2))
      .attr('y', (h / 2) + 5)
      .style('font-size', '.75rem')
      .style('fill', 'white')
      .text(d => d.value)

    // add some labels for percentages
    join.append('text')
      .attr('class', 'text-percent')
      .attr('text-anchor', 'middle')
      .attr('x', d => xScale(d.cumulative) + (xScale(d.value) / 2))
      .attr('y', (h / 2) - (halfBarHeight * 1.1))
      .style('font-size', '.75rem')
      .text(d => f(d.percent) + ' %')
  }

  useEffect(drawChart, [containerPxWidth, notStarted, inProgress, complete])

  return (
    <div ref={ref} id={`stacked-bar-chart-${id}`}></div>
  )
}

const Legend = () => {
  return (
    <div className='text-xs font-semibold text-slate-500 flex justify-between'>
      <div className='flex gap-2 items-center'>
        <StatusBubble status='Not Started' />
        <span>Not Started</span>
      </div>
      <div className='flex gap-2 items-center'>
        <StatusBubble status='In Progress' />
        <span>In Progress</span>
      </div>
      <div className='flex gap-2 items-center'>
        <StatusBubble status='Completed' />
        <span>Completed</span>
      </div>
    </div>
  )
}

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
          <Legend />
          <div>
            <p className='font-semibold text-slate-800'>School Summary</p>
            <p className='text-xs text-slate-500'>Fixture replacement status by school</p>
            <StackedBarChart
              id='school'
              containerPxWidth={containerRef?.current?.clientWidth}
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
              id='fixture'
              containerPxWidth={containerRef?.current?.clientWidth}
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
