import React, { useEffect, useRef, useState } from 'react'
import { useDataContext } from '@/Contexts/DataContext'
import { Map as AxiomMap, IGeoJSONLayerProps, ILayerQueryEvent, IMap, IStyleableMapProps } from '@axdspub/axiom-maps'
import { Button, Loader } from '@axdspub/axiom-ui-utilities'
import getLayer, { ISchool } from '@/Services/MapLayer'
import MapFilters from '@/Components/MapFilters'
import MapPopup from '@/Components/MapPopup'
import MapSidebar from '@/Components/MapSidebar'
import School from '@/Pages/School/School'
import { useSchoolContext } from '@/Contexts/SchoolContext'
import { useNavigate, useParams } from 'react-router-dom'
import { getSchoolIdFromSlug, getSlugFromSchoolId } from '@/Services/SchoolId'
import { useWindowSize } from 'usehooks-ts'
import { ListBulletIcon, MapIcon } from '@heroicons/react/24/outline'
import { useMapPreviewContext } from '@/Contexts/MapPreviewContext'

interface IMobileViewToggleProps {
  show: boolean
  onToggle: (view: 'map' | 'list') => void
}

const MobileViewToggle = ({ show, onToggle }: IMobileViewToggleProps) => {
  const [view, setView] = useState<'map' | 'list'>('map')
  const label = view === 'map' ? 'List' : 'Map'
  const onClick = () => {
    const newView = view === 'map' ? 'list' : 'map'
    setView(newView)
    onToggle(newView)
  }
  const Icon = () => view === 'list' ? <MapIcon width='1rem' height='1rem' /> : <ListBulletIcon width='1rem' height='1rem' />
  if (show) {
    return (
      <Button
        className='absolute z-10 w-[110px] bottom-0 left-1/2 translate-x-[-50%] mb-8
        shadow-xl flex items-center gap-2 px-6 bg-slate-100 text-slate-800
        font-semibold border-slate-200 active:bg-slate-200 hover:border-slate-200'
        onClick={onClick}
      >
        <Icon />
        {label}
      </Button>
    ) 
  } else {
    return (
      <></>
    )
  }
}

const Map = () => {
  const DESKTOP_WIDTH_PX = 1024
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { data, filteredSchools } = useDataContext()
  const { school: schoolToPreview, screenCoordinates, coordinates, setSchoolToPreview, setScreenCoordinates } = useMapPreviewContext()
  const [map, setMap] = useState<IMap | undefined>(undefined)
  const [layer, setLayer] = useState<IGeoJSONLayerProps | undefined>(undefined)
  // const [selectEvent, setSelectEvent] = useState<ILayerQueryEvent | null>(null)
  // const [popupCoordinates, setPopupCoordinates] = useState<[number, number] | [undefined, undefined]>([undefined, undefined])
  // const [popupSchool, setPopupSchool] = useState<ISchool | undefined>(undefined)
  const { width } = useWindowSize()
  const [isMobileView, setIsMobileView] = useState(width < DESKTOP_WIDTH_PX)
  const [showViewToggle, setShowViewToggle] = useState(width < DESKTOP_WIDTH_PX)
  const [view, setView] = useState<'map' | 'list'>('map')
  const [shouldShowMap, setShouldShowMap] = useState(showViewToggle)
  const { selectedSchool, selectSchool } = useSchoolContext()
  const { slug } = useParams()
  const navigate = useNavigate()

  const MAP_CONFIG: IStyleableMapProps = {
    baseLayerKey: 'hybrid',
    mapLibraryKey: 'leaflet',
    height: '100%',
    style: {
      left: '0px',
      top: '0px',
      right: '0px',
      bottom: '0px',
      padding: '0'
    },
    center: { lat: 20.57, lon: -157.47 },
    zoom: 8
  }

  const updateLayerWithFilteredData = () => {
    if (data === null) return
    const dataToUse = filteredSchools === null ? data.bySchool : filteredSchools
    const newLayer = getLayer(dataToUse)
    // newLayer.onMouseOver = setSelectEvent
    newLayer.onMouseOver = event => {
      if (event?.data?.windowPoint !== undefined) {
        // setPopupCoordinates([event.data.windowPoint.x, event.data.windowPoint.y])
        setScreenCoordinates([event.data.windowPoint.x, event.data.windowPoint.y])
      }
      if (event?.data?.feature?.properties?.data !== undefined) {
        // setPopupSchool(event?.data?.feature?.properties?.data)
        setSchoolToPreview(event?.data?.feature?.properties?.data)
      }
    }
    newLayer.onMouseOut = () => {
      // setSelectEvent(null)
      // setPopupCoordinates([undefined, undefined])
      // setPopupSchool(undefined)
      setScreenCoordinates(null)
      setSchoolToPreview(null)
      newLayer.implementation?.unsetSelectedFeature()
    }
    newLayer.onSelect = (event: ILayerQueryEvent) => {
      selectSchool(event.data?.feature?.properties?.data?.school ?? null)
    }
    setLayer(newLayer)
  }

  useEffect(updateLayerWithFilteredData, [data, filteredSchools])

  useEffect(() => {
    if (layer !== undefined) map?.reloadLayers([layer])
  }, [layer])

  useEffect(() => {
    if (data === null) return
    selectSchool(slug === undefined ? null : getSchoolIdFromSlug(slug))
  }, [data, slug])

  useEffect(() => {
    if (selectedSchool !== null) {
      navigate({ pathname: `/schools/${getSlugFromSchoolId(selectedSchool?.school)}` })
    }
  }, [selectedSchool])

  useEffect(() => {
    const mobile = width < DESKTOP_WIDTH_PX
    setShowViewToggle(mobile)
    setIsMobileView(mobile)
  }, [width])

  useEffect(() => {
    if (showViewToggle) {
      setShouldShowMap(view === 'map')
    } else {
      setShouldShowMap(true)
    }
  }, [showViewToggle, view])

  useEffect(() => {
    if (layer === undefined || coordinates === null) return
    const newScreenCoordinates = layer.implementation?.getWindowPoint(coordinates[1], coordinates[0])
    const mapYOffset = mapContainerRef.current?.offsetTop ?? 0
    if (newScreenCoordinates === undefined) setScreenCoordinates(null)
    else setScreenCoordinates([newScreenCoordinates.x, newScreenCoordinates.y + mapYOffset])
  }, [coordinates])

  const MapLoader = () => {
    if (layer !== undefined) return <></>
    if (showViewToggle && view === 'map') {
      return (
        <div className='w-full h-full'>
          <div className='w-full h-full flex justify-center items-center bg-slate-200 animate-pulse'>
            <Loader />
          </div>
        </div>
      )
    } else if (!showViewToggle) {
      return (
        <div className='w-2/3 h-full'>
          <div className='w-full h-full flex justify-center items-center bg-slate-200 animate-pulse'>
            <Loader />
          </div>
        </div>
      )
    } else {
      return <></>
    }
  }

  return (
    <div className='w-full max-w-full h-full max-h-full flex flex-col'>
      <div className='h-[8rem] max-h-[8rem] lg:h-[6rem] lg:max-h-[6rem] flex flex-col divide-y border-b border-slate-200'>
        <div className='flex px-4 py-2 w-full text-center'>
          <a href='https://health.hawaii.gov/heer/environmental-health/highlighted-projects/WIIN/'>
            <img src='/DOH-Logo-with-text-circling.png' width='40' />
          </a>
          <div className='px-4 py-2 font-semibold text-slate-800 text-center w-full'>Hawaii Lead Water Monitor</div>
        </div>
        <div className='max-w-full h-full py-2 lg:py-1 no-scrollbar grow overflow-x-scroll sm:overflow-visible'><MapFilters /></div>
      </div>
      <div className='flex h-[calc(100%-8rem)] max-h-[calc(100%-8rem)] lg:h-[calc(100%-6rem)] lg:max-h-[calc(100%-6rem)]'>
        <MapLoader />
        {
          layer === undefined ? <></> :
            <div
              ref={mapContainerRef}
              style={{ width: shouldShowMap && showViewToggle ? '100%' : 'calc(2*100%/3)', display: shouldShowMap ? 'block' : 'none' }}
            >
              <AxiomMap
                {...MAP_CONFIG}
                setState={setMap}
                layers={[layer]}
              />
            </div>
        }

        {
          (showViewToggle && view === 'list') || !showViewToggle ?
            <div className='w-full lg:w-1/3 bg-slate-100'><MapSidebar /></div> :
            <></>
        }
      </div>
      {schoolToPreview === null || screenCoordinates === null ?
        <></> :
        <MapPopup
          mapViewport={mapContainerRef.current?.getBoundingClientRect()}
          featureX={screenCoordinates[0]}
          featureY={screenCoordinates[1]}
          school={schoolToPreview}
        />
      }
      {selectedSchool === null ?
        <></> :
        <School />
      }
      <MobileViewToggle
        show={showViewToggle}
        onToggle={setView}
      />
    </div>
  )
}

export default Map
