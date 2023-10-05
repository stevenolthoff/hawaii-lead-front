import React, { RefObject, ReactElement, useEffect, useRef, useState } from 'react'
import { ISchool } from '@/Services/MapLayer'
import { getNumCompleteFixtures, getNumInProgressFixtures } from '@/Services/SchoolStatus'
import SchoolSummaryCard from './SchoolSummaryCard'

interface IMapPopupProps {
  mapViewport?: DOMRect
  featureX?: number
  featureY?: number
  school?: ISchool
}

const MapPopup = ({
  mapViewport,
  featureX,
  featureY,
  school
}: IMapPopupProps): ReactElement => {
  const shouldShow = () => featureX !== undefined && featureY !== undefined && mapViewport !== undefined && school !== undefined
  const [show, setShow] = useState(shouldShow())
  const ref = useRef<HTMLDivElement>(null)
  const HEIGHT_REM = 8
  const WIDTH_REM = 16
  const PX_IN_REM = parseFloat(getComputedStyle(document.documentElement).fontSize)
  const HEIGHT_PX = HEIGHT_REM * PX_IN_REM
  const WIDTH_PX = WIDTH_REM * PX_IN_REM
  const POPUP_MARGIN_REM = 1
  const POPUP_MARGIN_PX = POPUP_MARGIN_REM * PX_IN_REM

  const schoolName = school?.school

  useEffect(() => {
    setShow(shouldShow())
  }, [mapViewport, featureX, featureY, school])

  const getTopPx = () => {
    if (featureY !== undefined && mapViewport !== undefined) {
      if ((featureY - HEIGHT_PX - POPUP_MARGIN_PX) < mapViewport.y) {
        return featureY + POPUP_MARGIN_PX
      } else {
        return featureY - HEIGHT_PX - POPUP_MARGIN_PX
      }
    } else {
      return 0
    }
  }

  const getLeftPx = () => {
    if (featureX !== undefined && mapViewport !== undefined) {
      if (featureX + WIDTH_PX / 2 > mapViewport.width) {
        return mapViewport.width - WIDTH_PX - POPUP_MARGIN_PX
      } else if (featureX - WIDTH_PX / 2 < mapViewport.x) {
        return POPUP_MARGIN_PX
      } else {
        return featureX - (WIDTH_PX / 2)
      }
    } else {
      return 0
    }
  }

  if (show) {
    return (
      <div
        ref={ref}
        className='fixed z-10 px-4 py-2 rounded-md bg-slate-100 shadow-xl flex justify-center items-center'
        style={{
          left: `${getLeftPx()}px`,
          top: `${getTopPx()}px`,
          height: `${HEIGHT_PX}px`,
          width: `${WIDTH_PX}px`
        }}
      >
        <SchoolSummaryCard schoolName={schoolName ?? ''} />
      </div>
    )
  } else {
    return <></>
  }
}

export default MapPopup
