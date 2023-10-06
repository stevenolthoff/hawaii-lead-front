/* eslint-disable react/prop-types */
import React, { MouseEvent, ReactElement, useEffect, useRef, useState } from 'react'
import useEscapeKey from '@/Hooks/useEscapeKey'
import BubbleLegend from '@/Components/BubbleLegend'
import StackedBarChart from '@/Components/StackedBarChart'
import { getNumCompleteFixtures, getNumInProgressFixtures } from '@/Services/SchoolStatus'
import { XMarkIcon, CheckIcon } from '@heroicons/react/20/solid'
import { IFixture } from '@/Contexts/DataContext'
import { DateTime } from 'luxon'
import { useSchoolContext } from '@/Contexts/SchoolContext'
import { useNavigate } from 'react-router-dom'
import _ from 'lodash'
import { getFixtureLabel } from '@/Services/FixtureLabel'
import { Transition } from '@headlessui/react'

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
        width: '1.4rem',
        height: '1.4rem'
      }
    }
    return (
      <div
        key={`stepper-${id}-step-${i}`}
        className='relative w-full flex justify-center items-center'
      >
        <div className='absolute w-1/2 h-0.5 right-1/2 shadow-inner' style={{ visibility: i === 0 ? 'hidden' : 'visible', ...leftLineStyle }}></div>
        <div className='relative rounded-full w-4 h-4 z-20 shadow-inner border bg-slate-100 has-tooltip' style={bubbleStyle}>
          {
            d.tooltip === undefined ?
              null :
              <span className='tooltip rounded shadow-lg p-2 bg-gray-100 text-slate-800 block grow -mt-[35px] self-center text-sm'>
                {d.tooltip}
              </span>
          }
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


const School = () => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [clientWidth, setClientWidth] = useState<number | undefined>(undefined)
  const { selectSchool, selectedSchool } = useSchoolContext()
  const navigate = useNavigate()
  const onClickInside = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    event.preventDefault()
  }
  const onClickOutside = () => {
    navigate({ pathname: '/schools' })
    selectSchool(null)
  }
  useEffect(() => {
    if (cardRef.current !== null) {
      setClientWidth(cardRef.current.clientWidth)
    }
  }, [cardRef])
  useEscapeKey(onClickOutside)
  const numComplete = getNumCompleteFixtures(selectedSchool?.fixtures ?? [])
  const numInProgress = getNumInProgressFixtures(selectedSchool?.fixtures ?? [])
  const numNotStarted = (selectedSchool?.fixtures.length ?? 0) - numComplete - numInProgress
  const tableHeaderClassName = 'text-xs leading-none font-semibold text-slate-500 pb-2 break-words'
  const bubbleIsFilled = (fixture: IFixture, key: string): boolean => {
    return fixture[key] !== null && String(fixture[key]).toLowerCase() !== 'no'
  }
  const getFormattedDate = (value: string | null) => {
    return value === null ? undefined : DateTime.fromISO(value).toLocaleString({ dateStyle: 'medium' })
  }
  if (selectedSchool === null) {
    return <></>
  }
  return (
    <div
      className='w-full max-w-full h-full max-h-full absolute z-20 flex justify-center shadow-2xl bg-slate-800/25 hover:cursor-pointer'
      onClick={onClickOutside}
    >
      <div
        ref={cardRef}
        className='sm:w-full lg:w-[80%] xl:w-[50%] h-full max-h-full bg-slate-100 py-4 px-4 pb-16 overflow-y-scroll hover:cursor-default scrollbox'
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
        <p className='font-semibold text-xl'>{selectedSchool?.school}</p>
        <p className='text-slate-500 text-lg'>{selectedSchool?.fixtures[0].island} / {selectedSchool?.fixtures[0].district}</p>
        <BubbleLegend />
        <StackedBarChart
          id={`stacked-bar-chart-school-${selectedSchool.school.toLowerCase().replaceAll(' ', '-')}`}
          notStarted={numNotStarted}
          inProgress={numInProgress}
          complete={numComplete}
        />
        <div className='grid grid-cols-7'>
          <div className={tableHeaderClassName}>Room No</div>
          <div className={tableHeaderClassName}>Type</div>
          <div className={tableHeaderClassName + ' text-center'}>Replacement Scheduled</div>
          <div className={tableHeaderClassName + ' text-center'}>Replacement Installed</div>
          <div className={tableHeaderClassName + ' text-center'}>Sample Collected</div>
          <div className={tableHeaderClassName + ' text-center'}>Results Received</div>
          <div className={tableHeaderClassName + ' text-center'}>Released</div>

          {
            _.sortBy(selectedSchool?.fixtures, ['room_no', 'source_type', 'asc', 'asc'])
              .map((fixture, i) => (
                <div key={i} className='contents group'>
                  <div
                    key={`school-${selectedSchool?.school}-fixture-${i}-room-no`}
                    className='text-sm group-hover:bg-slate-200 p-2'
                  >
                    {fixture.room_no}
                  </div>
                  <div
                    key={`school-${selectedSchool?.school}-fixture-${i}-source-type`}
                    className='text-sm break-word group-hover:bg-slate-200 p-2'
                  >
                    {getFixtureLabel(fixture.source_type)}
                  </div>
                  <Stepper
                    key={`school-${selectedSchool?.school}-stepper-${i}`}
                    id={selectedSchool.school}
                    className='col-span-5 group-hover:bg-slate-200'
                    data={[
                      {
                        filled: bubbleIsFilled(fixture, 'date_replacement_scheduled'),
                        tooltip: getFormattedDate(fixture['date_replacement_scheduled'])
                      },
                      {
                        filled: bubbleIsFilled(fixture, 'date_replaced'),
                        tooltip: getFormattedDate(fixture['date_replaced'])
                      },
                      {
                        filled: bubbleIsFilled(fixture, 'confirmation_sample_collection_date'),
                        tooltip: getFormattedDate(fixture['confirmation_sample_collection_date'])
                      },
                      {
                        filled: bubbleIsFilled(fixture, 'date_results_received'),
                        tooltip: getFormattedDate(fixture['date_results_received'])
                      },
                      {
                        filled: bubbleIsFilled(fixture, 'released_for_unrestricted_use?'),
                        tooltip: fixture['released_for_unrestricted_use?']
                      }
                    ]}
                  />
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default School
