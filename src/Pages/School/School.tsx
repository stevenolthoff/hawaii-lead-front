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
}
const Row = ({ fixture, id }: IRowProps) => {
  const [expand, setExpand] = useState(false)
  const bubbleIsFilled = (fixture: IFixture, key: string): boolean => {
    return fixture[key] !== null && String(fixture[key]).toLowerCase() !== 'no'
  }
  const getFormattedDate = (value: string | null) => {
    return value === null ? <p className='text-slate-300 text-center'>No Data</p> : DateTime.fromISO(value).toLocaleString({ dateStyle: 'medium' })
  }
  const getReleasedTooltip = (fixture: IFixture): string | ReactElement => {
    let text = ''
    const released_for_unrestricted_use = fixture['released_for_unrestricted_use?']
    if (released_for_unrestricted_use === '' || released_for_unrestricted_use === null) return <p className='text-slate-300 text-center'>No Data</p>
    const { flush_result_ppb, confirmation_result_ppb } = fixture
    if (released_for_unrestricted_use !== '' && released_for_unrestricted_use !== null) {
      text += `Released?: ${released_for_unrestricted_use}`
    }
    if (flush_result_ppb !== '' && flush_result_ppb !== null) {
      text += `\nFlush: ${flush_result_ppb} PPB`
    }
    if (confirmation_result_ppb !== '' && confirmation_result_ppb !== null) {
      text += `\nConfirmation: ${confirmation_result_ppb} PPB`
    }
    return text
  }
  const getPhotoLabel = (fixture: IFixture) => {
    if (fixture.replaced_fixtures_photo_url === null || fixture.replaced_fixtures_photo_url === '') {
      return 'No Photo'
    } else {
      return 'Photo'
    }
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
          className='text-sm group-hover:bg-slate-200 group-hover:cursor-pointer p-2'
        >
          {fixture.room_no}
        </div>
        <div
          key={`fixture-${id}-source-type`}
          className='text-sm break-word group-hover:bg-slate-200 group-hover:cursor-pointer p-2'
        >
          {getFixtureLabel(fixture.source_type)}
        </div>
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
              filled: bubbleIsFilled(fixture, 'released_for_unrestricted_use?')
            }
          ]}
        />
        <div
          key={`fixture-${id}-photo`}
          className='text-sm break-word group-hover:bg-slate-200 group-hover:cursor-pointer p-2'
        >
          {getPhotoLabel(fixture)}
        </div>
      </div>
      {
        expand ?
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
        <p className='font-semibold text-xl'>{selectedSchool.school}</p>
        <p className='text-slate-500 text-lg'>{selectedSchool?.fixtures[0].island} / {selectedSchool?.fixtures[0].district}</p>
        <BubbleLegend />
        <StackedBarChart
          id={`stacked-bar-chart-school-${selectedSchool.id.toLowerCase()}`}
          notStarted={numNotStarted}
          inProgress={numInProgress}
          complete={numComplete}
        />
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
            _.sortBy(selectedSchool?.fixtures, ['room_no', 'source_type', 'asc', 'asc'])
              .map((fixture, i) => (
                <Row key={i} id={`${i}`} fixture={fixture} />
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default School
