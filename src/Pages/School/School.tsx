/* eslint-disable react/prop-types */
import React, { MouseEvent, ReactElement, useEffect, useRef, useState } from 'react'
import { ISchool } from '@/Services/MapLayer'
import BubbleLegend from '@/Components/BubbleLegend'
import StackedBarChart from '@/Components/StackedBarChart'
import { getNumCompleteFixtures, getNumInProgressFixtures } from '@/Services/SchoolStatus'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { IFixture } from '@/Contexts/DataContext'

interface IStepperProps {
  id: string
  className?: string
  data?: {
    tooltip?: string,
    filled: boolean
  }[]
}

const Stepper = ({ id, data, className }: IStepperProps): ReactElement => {
  const steps = data?.map((d, i) => {
    return (
      <div
        key={`stepper-${id}-step-${i}`}
        className='relative w-full flex justify-center items-center'
      >
        <div className='absolute w-1/2 h-1 right-1/2 shadow-inner border' style={{ visibility: i === 0 ? 'hidden' : 'visible' }}></div>
        <div className='rounded-full w-4 h-4 z-20 shadow-inner border bg-slate-100'></div>
        <div className='absolute w-1/2 h-1 left-1/2 shadow-inner border' style={{ visibility: i === data.length - 1 ? 'hidden' : 'visible' }}></div>
      </div>
    )
  })
  const wrapperClassName = (className ?? '').concat(' w-full flex justify-between')
  return (
    <div className={wrapperClassName}>
      {steps}
    </div>
  )
}

interface ISchoolProps {
  onClickOutside: () => void
  school: ISchool | null
}

const School = ({ onClickOutside, school }: ISchoolProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const onClickInside = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    event.preventDefault()
  }
  const numComplete = getNumCompleteFixtures(school?.fixtures ?? [])
  const numInProgress = getNumInProgressFixtures(school?.fixtures ?? [])
  const numNotStarted = school?.fixtures.length ?? 0 - numComplete - numInProgress
  const StackedBarChartOrNull = () => {
    return <div>
      {
        cardRef?.current?.clientWidth === undefined ?
          <></> :
          <StackedBarChart
            id={`stacked-bar-chart-school-${school?.school.toLowerCase().replace(' ', '-')}`}
            width={cardRef.current.clientWidth}
            notStarted={numNotStarted}
            inProgress={numInProgress}
            complete={numComplete}
          />
      }
    </div>
  }
  const StepperBubble = ({
    key,
    data,
    dataOnRight,
    final = false
  }: {
    key: string,
    data: string | null,
    dataOnRight: string | null,
    final?: boolean
  }): ReactElement => {
    const slate100 = '#f1f5f9'
    const slate300 = '#cbd5e1'
    const blue500 = '#3b82f6'
    const green500 = '#22c55e'
    const red500 = '#ef4444'
    let backgroundColor = ''
    let border = ''
    if (final) {
      if (data === null) {
        backgroundColor = slate100
        border = '2px solid #cbd5e1'
      } else if (data || data.toLowerCase() === 'yes') {
        backgroundColor = green500
      } else {
        backgroundColor = red500
      }
    } else {
      if (data === null) {
        backgroundColor = slate100
        border = `2px solid ${slate300}`
      } else {
        backgroundColor = blue500
      }
    }
    return (
      <div
        key={key}
        className='w-full h-full flex items-center relative'
      >
        <div
          className='rounded-full w-4 h-4 z-20'
          style={{
            backgroundColor,
            border
          }}
        >  
        </div>
        <div
          className='w-full h-1 absolute bg-green-500'
          style={{
            backgroundColor: dataOnRight === null ? slate300 : blue500,
            visibility: final ? 'hidden' : 'visible'
          }}
        >
        </div>
      </div>
    )
  }
  const tableHeaderClassName = 'text-xs leading-none font-semibold text-slate-500'
  return (
    <div
      className='w-full max-w-full h-full max-h-full absolute z-20 flex justify-center shadow-2xl bg-slate-800/25 hover:cursor-pointer'
      onClick={onClickOutside}
    >
      <div
        ref={cardRef}
        className='w-1/2 max-w-1/2 h-full max-h-full bg-slate-100 py-4 overflow-y-scroll hover:cursor-default scrollbox'
        style={{
        }}
        onClick={onClickInside}
      >
        <div className='flex justify-end'>
          <XMarkIcon
            className='h-12 w-12 text-slate-400 hover:cursor-pointer'
            onClick={onClickOutside}
          />
        </div>
        <p className='font-semibold text-xl'>{school?.school}</p>
        <p className='text-slate-500 text-lg'>{school?.fixtures[0].island} / {school?.fixtures[0].district}</p>
        <BubbleLegend />
        <StackedBarChartOrNull />
        <div className='grid grid-cols-7'>
          <div className={tableHeaderClassName}>Room No</div>
          <div className={tableHeaderClassName}>Type</div>
          <div className={tableHeaderClassName}>Replacement Scheduled</div>
          <div className={tableHeaderClassName}>Replacement Installed</div>
          <div className={tableHeaderClassName}>Sample Collected</div>
          <div className={tableHeaderClassName}>Results Received</div>
          <div className={tableHeaderClassName}>Released</div>

          {
            school?.fixtures.map((fixture, i) => [
              <div key={`school-${school}-fixture-${i}-room-no`}>
                {fixture.room_no}
              </div>,
              <div key={`school-${school}-fixture-${i}-source-type`}>
                {fixture.source_type}
              </div>,
              <Stepper
                key={`school-${school}-stepper-${i}`}
                id={school?.school}
                className='col-span-5'
                data={[
                  {
                    filled: true
                  },
                  {
                    filled: true
                  },
                  {
                    filled: true
                  },
                  {
                    filled: true
                  },
                  {
                    filled: true
                  }
                ]}
              />
            ])
          }
          {/* {
            school?.fixtures.map((fixture, i) => [
              <div key={`school-${school}-fixture-${i}-room-no`}>
                {fixture.room_no}
              </div>,
              <div key={`school-${school}-fixture-${i}-source-type`}>
                {fixture.source_type}
              </div>,
              <StepperBubble
                key={`school-${school}-fixture-${i}-date_replacement_scheduled`}
                data={fixture.date_replacement_scheduled}
                dataOnRight={fixture.date_replaced}
              />,
              <StepperBubble
                key={`school-${school}-fixture-${i}-date_replaced`}
                data={fixture.date_replaced}
                dataOnRight={fixture.confirmation_sample_collection_date}
              />,
              <StepperBubble
                key={`school-${school}-fixture-${i}-confirmation_sample_collection_date`}
                data={fixture.confirmation_sample_collection_date}
                dataOnRight={fixture.date_results_received}
              />,
              <StepperBubble
                key={`school-${school}-fixture-${i}-date_results_received`}
                data={fixture.date_results_received}
                dataOnRight={fixture['released_for_unrestricted_use?']}
              />,
              <StepperBubble
                key={`school-${school}-fixture-${i}-released_for_unrestricted_use`}
                data={fixture['released_for_unrestricted_use?']}
                dataOnRight={null}
                final={true}
              />,
            ])
          } */}
        </div>
      </div>
    </div>
  )
}

export default School
