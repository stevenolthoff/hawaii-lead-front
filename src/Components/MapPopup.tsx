import React, { ReactElement, useEffect, useState } from 'react'
import { ISchool } from '@/Services/MapLayer'

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

  if (show) {
    return (
      <div
        className='absolute bg-slate-300 z-10'
        style={{ left: `${windowX}px`, top: `${windowY}px` }}
      >
        { schoolName }
      </div>
    )
  } else {
    return <></>
  }
}

export default MapPopup
