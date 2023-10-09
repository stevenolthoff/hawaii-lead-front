import React, { useEffect, ReactElement, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useWindowSize } from 'usehooks-ts'

interface IStackedBarChartProps {
  id: string
  notStarted: number
  inProgress: number
  complete: number
  // width: number
}

const StackedBarChart = ({ id, notStarted, inProgress, complete }: IStackedBarChartProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const { width: windowWidth } = useWindowSize()
  const drawChart = () => {
    setLoading(true)
    const container = d3.select(`#${id}`)
    const containerPxWidth = parseInt(container?.style('width'))
    if (container === null) return
    const chart = d3.select(`#${id}`).selectChildren('svg')
    console.log('chart selection', chart, id)
    if (!chart.empty()) {
      chart.remove()
    }
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
    const width = containerPxWidth ?? 100
    const w = width - margin.left - margin.right
    const h = height * 0.66

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

    // const sel = d3.select(ref.current)
    const sel = container
      .append('svg')
      .attr('id', id)
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
      .style('font-size', '.7rem')
      .text(d => f(d.percent) + '%')

    setLoading(false)
  }

  useEffect(drawChart, [notStarted, inProgress, complete, windowWidth, containerWidth])

  useEffect(() => {
    if (ref.current?.clientWidth === undefined) return
    setContainerWidth(ref.current.clientWidth)
  }, [ref.current?.clientWidth])

  return (
    <div ref={ref} id={id} className='w-full h-[100px] first-letter:p-4 flex items-center'>
      {
        loading ?
          <div className='h-[50px] rounded-md bg-slate-300'></div> :
          <></>
      }
    </div>
  )
}

export default StackedBarChart
