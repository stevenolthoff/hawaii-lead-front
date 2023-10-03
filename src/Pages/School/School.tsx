/* eslint-disable react/prop-types */
import React, { MouseEvent, ReactElement, useEffect, useRef, useState } from 'react'
import { ISchool } from '@/Services/MapLayer'
import BubbleLegend from '@/Components/BubbleLegend'
import StackedBarChart from '@/Components/StackedBarChart'
import { getNumCompleteFixtures, getNumInProgressFixtures } from '@/Services/SchoolStatus'
import { XMarkIcon, CheckIcon } from '@heroicons/react/20/solid'
import { IFixture } from '@/Contexts/DataContext'

interface IStepperProps {
  id: string
  className?: string
  data: {
    tooltip?: string,
    filled: boolean
  }[]
}

const Stepper = ({ id, data, className }: IStepperProps): ReactElement => {
  const slate100 = '#f1f5f9'
  const green500 = '#22c55e'
  const yellow500 = '#eab308'
  let completelyFilled = false
  let indexOfFinalFilled: number | undefined = undefined
  for (let i = data.length - 1; i >= 0; i -= 1) {
    if (data[i].filled) {
      indexOfFinalFilled = i
      break
    }
  }
  completelyFilled = indexOfFinalFilled !== undefined && indexOfFinalFilled === data.length - 1
  const filledStyle = {
    backgroundColor: yellow500
  }
  const completelyFilledStyle = {
    backgroundColor: green500
  }
  const steps = data.map((d, i) => {
    const filled = completelyFilled || (indexOfFinalFilled !== undefined && i <= indexOfFinalFilled)
    const nextIsFilled = completelyFilled || (indexOfFinalFilled !== undefined && (i + 1) <= indexOfFinalFilled)
    let leftLineStyle
    let rightLineStyle
    let bubbleStyle: React.CSSProperties = {
      backgroundColor: slate100, boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
    }
    if (nextIsFilled) {
      rightLineStyle = filledStyle
    }
    if (completelyFilled) {
      leftLineStyle = completelyFilledStyle
      rightLineStyle = completelyFilledStyle
      bubbleStyle = {
        ...bubbleStyle,
        ...completelyFilledStyle
      }
    } else if (filled) {
      leftLineStyle = filledStyle
      bubbleStyle = { ...bubbleStyle, ...filledStyle }
    }
    if (i === data.length - 1 && filled) {
      bubbleStyle = {
        ...bubbleStyle,
        width: '1.25rem',
        height: '1.25rem'
      }
    }
    return (
      <div
        key={`stepper-${id}-step-${i}`}
        className='relative w-full flex justify-center items-center'
      >
        <div className='absolute w-1/2 h-0.5 right-1/2 shadow-inner' style={{ visibility: i === 0 ? 'hidden' : 'visible', ...leftLineStyle }}></div>
        <div className='rounded-full w-3 h-3 z-20 shadow-inner border bg-slate-100' style={bubbleStyle}>
          <CheckIcon className='text-slate-100' style={{ visibility: filled && i === data.length - 1 ? 'visible' : 'hidden' }}/>
        </div>
        <div className='absolute w-1/2 h-0.5 left-1/2 shadow-inner' style={{ visibility: i === data.length - 1 ? 'hidden' : 'visible', ...rightLineStyle }}></div>
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
  const tableHeaderClassName = 'text-xs leading-none font-semibold text-slate-500'
  const bubbleIsFilled = (fixture: IFixture, key: string): boolean => {
    return fixture[key] !== null && String(fixture[key]).toLowerCase() !== 'no'
  }
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
                    filled: bubbleIsFilled(fixture, 'date_replacement_scheduled'),
                  },
                  {
                    filled: bubbleIsFilled(fixture, 'date_replaced')
                  },
                  {
                    filled: bubbleIsFilled(fixture, 'confirmation_sample_collection_date')
                  },
                  {
                    filled: bubbleIsFilled(fixture, 'date_results_received')
                  },
                  {
                    filled: bubbleIsFilled(fixture, 'released_for_unrestricted_use?')
                  }
                ]}
              />
            ])
          }
        </div>
      </div>
    </div>
  )
}

export default School
