import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { ISchool } from '@/Services/MapLayer'
import { getNumCompleteFixtures, getNumInProgressFixtures } from '@/Services/SchoolStatus'

interface IMapPopupProps {
  windowX?: number
  windowY?: number
  school?: ISchool
}

const MapPopup = ({
  windowX,
  windowY,
  school
}: IMapPopupProps): ReactElement => {
  const shouldShow = () => windowX !== undefined && windowY !== undefined
  const [show, setShow] = useState(shouldShow())
  const ref = useRef<HTMLDivElement>(null)
  const HEIGHT_REM = 8
  const WIDTH_REM = 16
  const POPUP_MARGIN_REM = 1

  useEffect(() => {
    setShow(shouldShow())
  }, [windowX, windowY])

  const schoolName = school?.school
  const fixtures = school?.fixtures ?? []
  const numFixtures = fixtures.length
  const numComplete = getNumCompleteFixtures(fixtures)
  const numInProgress = getNumInProgressFixtures(fixtures)
  const numNotStarted = numFixtures - numComplete - numInProgress

  if (show) {
    return (
      <div
        ref={ref}
        className='absolute bg-slate-300 z-10'
        style={{
          left: `calc(${(windowX ?? 0)}px - ${WIDTH_REM / 2}rem)`,
          top: `calc(${(windowY ?? 0)}px - ${HEIGHT_REM + POPUP_MARGIN_REM}rem)`,
          height: `${HEIGHT_REM}rem`,
          width: `${WIDTH_REM}rem`
        }}
      >
        { schoolName }
        <p>Complete { numComplete } / { numFixtures }</p>
        <p>In Progress { numInProgress } / { numFixtures }</p>
        <p>Not Started { numNotStarted } / { numFixtures }</p>
      </div>
    )
  } else {
    return <></>
  }
}

export default MapPopup
