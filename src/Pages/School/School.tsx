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
import Image from '@/Components/Image'
import { ISchool } from '@/Services/MapLayer'
import { useWindowSize } from 'usehooks-ts'

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
        <div className='relative rounded-full w-4 h-4 z-20 shadow-inner border bg-slate-100' style={bubbleStyle}>
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

interface IRowProps {
  fixture: IFixture
  id: string
  isMobile: boolean
}
const Row = ({ fixture, id, isMobile }: IRowProps) => {
  const [expand, setExpand] = useState(false)
  const bubbleIsFilled = (fixture: IFixture, key: 'date_replaced' | 'date_replacement_scheduled' | 'confirmation_sample_collection_date' | 'date_results_received' | 'fixture_status'): boolean => {
    return fixture[key] !== null && String(fixture[key]).toLowerCase() !== 'no'
  }
  const getFormattedDate = (value: string | null) => {
    return value === null ? <p className='text-slate-300 text-center'>No Data</p> : DateTime.fromISO(value).toLocaleString({ dateStyle: 'medium' })
  }
  const getReleasedTooltip = (fixture: IFixture): string | ReactElement => {
    let text = ''
    const { fixture_status } = fixture
    if (fixture_status === null) return <p className='text-slate-300 text-center'>No Data</p>
    const { lead_ppb_flush, lead_ppb_confirmation } = fixture
    if (fixture_status === 'flush_for_drinking') {
      text += 'Released?: Flush for 30 seconds'
    } else if (fixture_status === 'unrestricted') {
      text += 'Released for unrestricted use'
    } else if (fixture_status === 'non_potable') {
      text += 'Non-Potable Use Only'
    }
    if (lead_ppb_flush !== null) {
      text += `\nFlush Test: ${lead_ppb_flush} PPB`
    }
    if (lead_ppb_confirmation !== null) {
      text += `\nConfirmation Test: ${lead_ppb_confirmation} PPB`
    }
    return text
  }
  const onClickRow = () => {
    setExpand(!expand)
  }
  const expandedClassName = 'text-xs text-slate-800 font-semibold'
  const dividerClassName = 'flex justify-center text-slate-300 pb-2 font-normal'
  return (
    <div key={`row-${id}`} className='contents'>
      <div className='group contents' onClick={onClickRow}>
        <div
          key={`fixture-${id}-room-no`}
          className='text-lg md:text-sm group-hover:bg-slate-200 group-hover:cursor-pointer p-2'
        >
          {fixture.room_number}
        </div>
        <div
          key={`fixture-${id}-source-type`}
          className='text-lg md:text-sm break-word group-hover:bg-slate-200 group-hover:cursor-pointer p-2'
        >
          {getFixtureLabel(fixture.source_type)}
        </div>
        {
          isMobile ?
            <div className='group-hover:bg-slate-200 group-hover:cursor-pointer text-center flex w-full h-full justify-center items-center'>
              {
                bubbleIsFilled(fixture, 'fixture_status') ?
                  <div className='w-4 h-4 bg-green-500 rounded text-white'>
                    <CheckIcon width='1rem' height='1rem' />
                  </div>
                  :
                  <div className='w-4 h-4 bg-red-500 rounded text-white'>
                    <XMarkIcon width='1rem' height='1rem' />
                  </div>
              }
            </div>:
            <Stepper
              key={`fixture-${id}-stepper`}
              id={id}
              className='col-span-5 group-hover:bg-slate-200 group-hover:cursor-pointer'
              data={[
                {
                  filled: bubbleIsFilled(fixture, 'date_replacement_scheduled')
                },
                {
                  filled: bubbleIsFilled(fixture, 'date_replaced')
                },
                {
                  filled: bubbleIsFilled(fixture, 'confirmation_sample_collection_date'),
                },
                {
                  filled: bubbleIsFilled(fixture, 'date_results_received')
                },
                {
                  filled: bubbleIsFilled(fixture, 'fixture_status')
                }
              ]}
            />
        }
        {
          isMobile ?
            <></> :
            <div
              key={`fixture-${id}-photo`}
              className='text-sm break-word group-hover:bg-slate-200 group-hover:cursor-pointer p-2 flex justify-center'
            >
              <Image src={fixture.replaced_fixtures_photo_url ?? undefined} />
            </div>
        }
      </div>
      {
        expand && !isMobile ?
          <div className='contents'>
            <div></div>
            <div></div>
            <div className={expandedClassName}>
              <div className={dividerClassName}>|</div>
              {getFormattedDate(fixture['date_replacement_scheduled'])}
            </div>
            <div className={expandedClassName}>
              <div className={dividerClassName}>|</div>
              {getFormattedDate(fixture['date_replaced'])}
            </div>
            <div className={expandedClassName}>
              <div className={dividerClassName}>|</div>
              {getFormattedDate(fixture['confirmation_sample_collection_date'])}
            </div>
            <div className={expandedClassName}>
              <div className={dividerClassName}>|</div>
              {getFormattedDate(fixture['date_results_received'])}
            </div>
            <div className={expandedClassName}>
              <div className={dividerClassName}>|</div>
              <pre className='font-sans'>{getReleasedTooltip(fixture)}</pre>
            </div>
            <div></div>
          </div> :
          null
      }
      {
        expand && isMobile ?
          <div className='contents'>
            <div className='col-span-3 text-slate-800 bg-slate-200 border-y-slate-300 border-y px-2 py-2'>
              <div className=''>
                <div className='text-lg font-semibold'>Replacement Scheduled</div>
                <div>{getFormattedDate(fixture['date_replacement_scheduled'])}</div>
              </div>
              <div className=''>
                <div className='text-lg font-semibold'>Date Replaced</div>
                <div>{getFormattedDate(fixture['date_replaced'])}</div>
              </div>
              <div className=''>
                <div className='text-lg font-semibold'>Confirmation Collection Date</div>
                <div>{getFormattedDate(fixture['confirmation_sample_collection_date'])}</div>
              </div>
              <div className=''>
                <div className='text-lg font-semibold'>Date Results Received</div>
                <div>{getFormattedDate(fixture['date_results_received'])}</div>
              </div>
              <div className=''>
                <div className='text-lg font-semibold'>Final Results</div>
                <div><pre className='font-sans'>{getReleasedTooltip(fixture)}</pre></div>
              </div>
            </div>
          </div> :
          <></>
      }
    </div>
  )
}

const DesktopTable = ({ selectedSchool }: { selectedSchool: ISchool }) => {
  const { width } = useWindowSize()
  const tableHeaderClassName = 'text-xs leading-none font-semibold text-slate-500 pb-2 break-words'
  const DESKTOP_BREAKPOINT_PX = 425
  if (width >= DESKTOP_BREAKPOINT_PX) {
    return (
      <div className='grid grid-cols-8'>
        <div className={tableHeaderClassName}>Room No</div>
        <div className={tableHeaderClassName}>Type</div>
        <div className={tableHeaderClassName + ' text-center'}>Replacement Scheduled</div>
        <div className={tableHeaderClassName + ' text-center'}>Replacement Installed</div>
        <div className={tableHeaderClassName + ' text-center'}>Sample Collected</div>
        <div className={tableHeaderClassName + ' text-center'}>Results Received</div>
        <div className={tableHeaderClassName + ' text-center'}>Released</div>
        <div className={tableHeaderClassName + ' text-center'}>Replacement Photo</div>

        {
          _.sortBy(selectedSchool.fixtures, ['room_no', 'source_type', 'asc', 'asc'])
            .map((fixture, i) => (
              <Row key={i} id={`${i}`} fixture={fixture} isMobile={false} />
            ))
        }
      </div>
    )
  } else {
    return <></>
  }
}

const MobileTable = ({ selectedSchool }: { selectedSchool: ISchool }) => {
  const { width } = useWindowSize()
  const tableHeaderClassName = 'text-xs leading-none font-semibold text-slate-500 pb-2 break-words'
  const DESKTOP_BREAKPOINT_PX = 425
  if (width < DESKTOP_BREAKPOINT_PX) {
    return (
      <div className='grid grid-cols-3'>
        <div className={tableHeaderClassName}>Room No</div>
        <div className={tableHeaderClassName}>Type</div>
        <div className={tableHeaderClassName + ' text-center'}>Released</div>

        {
          _.sortBy(selectedSchool.fixtures, ['room_no', 'source_type', 'asc', 'asc'])
            .map((fixture, i) => (
              <Row key={i} id={`${i}`} fixture={fixture} isMobile={true} />
            ))
        }
      </div>
    )
  } else {
    return <></>
  }
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
        className='w-full lg:w-[80%] xl:w-[50%] h-full max-h-full bg-slate-100 py-4 px-4 pb-16 overflow-y-scroll hover:cursor-default'
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
        <p className='font-semibold text-xl'>{selectedSchool.school}</p>
        <p className='text-slate-500 text-lg'>{selectedSchool?.fixtures[0].island} / {selectedSchool?.fixtures[0].district}</p>
        <BubbleLegend />
        <StackedBarChart
          id={`stacked-bar-chart-school-${selectedSchool.id.toLowerCase()}`}
          notStarted={numNotStarted}
          inProgress={numInProgress}
          complete={numComplete}
        />
        <DesktopTable selectedSchool={selectedSchool} />
        <MobileTable selectedSchool={selectedSchool} />
      </div>
    </div>
  )
}

export default School
