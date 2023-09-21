import React, { ReactElement, useEffect, useState } from 'react'
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

  useEffect(() => { setShow(shouldShow()) }, [windowX, windowY])

  const schoolName = school?.school
  const fixtures = school?.fixtures ?? []
  const numFixtures = fixtures.length
  const numComplete = getNumCompleteFixtures(fixtures)
  const numInProgress = getNumInProgressFixtures(fixtures)
  const numNotStarted = numFixtures - numComplete - numInProgress

  if (show) {
    return (
      <div
        className='absolute bg-slate-300 z-10'
        style={{ left: `${windowX}px`, top: `${windowY}px` }}
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
