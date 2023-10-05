import React, { useEffect, useRef, useState } from 'react'
import { useDataContext } from '@/Contexts/DataContext'
import { Map as AxiomMap, IGeoJSONLayerProps, ILayerQueryEvent, IMap, IStyleableMapProps } from '@axdspub/axiom-maps'
import { Button, Loader } from '@axdspub/axiom-ui-utilities'
import getLayer from '@/Services/MapLayer'
import MapFilters from '@/Components/MapFilters'
import MapPopup from '@/Components/MapPopup'
import MapSidebar from '@/Components/MapSidebar'
import School from '@/Pages/School/School'
import { useSchoolContext } from '@/Contexts/SchoolContext'
import { useNavigate, useParams } from 'react-router-dom'
import { getSchoolIdFromSlug, getSlugFromSchoolId } from '@/Services/SchoolId'
import { useWindowSize } from 'usehooks-ts'
import { ListBulletIcon, MapIcon } from '@heroicons/react/24/outline'

interface IMobileViewToggleProps {
  show: boolean
  onToggle: (view: 'map' | 'list') => void
}

const MobileViewToggle = ({ show, onToggle }: IMobileViewToggleProps) => {
  const [view, setView] = useState<'map' | 'list'>('list')
  const label = view === 'map' ? 'Map' : 'List'
  const onClick = () => {
    const newView = view === 'map' ? 'list' : 'map'
    setView(newView)
    onToggle(newView)
  }
  const Icon = () => view === 'map' ? <MapIcon width='1rem' height='1rem' /> : <ListBulletIcon width='1rem' height='1rem' />
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
  const [map, setMap] = useState<IMap | undefined>(undefined)
  const [layer, setLayer] = useState<IGeoJSONLayerProps | undefined>(undefined)
  const [selectEvent, setSelectEvent] = useState<ILayerQueryEvent | null>(null)
  const { width } = useWindowSize()
  const [showViewToggle, setShowViewToggle] = useState(width < DESKTOP_WIDTH_PX)
  const [view, setView] = useState<'map' | 'list'>('list')
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
    newLayer.onMouseOver = setSelectEvent
    newLayer.onMouseOut = () => {
      setSelectEvent(null)
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
    setShowViewToggle(width < DESKTOP_WIDTH_PX)
  }, [width])

  const ListView = () => {
    return (showViewToggle && view === 'list') || !showViewToggle ?
      <div className='w-full lg:w-1/3'>
        <MapSidebar />
      </div> :
      <></>
  }

  return (
    <div className='w-full max-w-full h-full max-h-full flex flex-col'>
      <div className='h-[6rem] max-h-[6rem] flex flex-col divide-y border-b border-slate-200'>
        <div className='flex px-4 py-2 w-full text-center'>
          <a href='https://health.hawaii.gov/heer/environmental-health/highlighted-projects/WIIN/'>
            <img src='/DOH-Logo-with-text-circling.png' width='40' />
          </a>
          <div className='px-4 py-2 font-semibold text-slate-800 text-center w-full'>Hawaii Lead Water Monitor</div>
        </div>
        <div className='max-w-full overflow-x-scroll no-scrollbar grow'><MapFilters /></div>
      </div>
      <div className='flex h-[calc(100%-6rem)] max-h-[calc(100%-6rem)]'>
        <div className='w-full lg:w-2/3' ref={mapContainerRef}>
          {layer === undefined ?
            <div className='w-full h-full flex justify-center items-center bg-slate-200 animate-pulse'><Loader /></div> :
            <AxiomMap
              {...MAP_CONFIG}
              setState={setMap}
              layers={[layer]}
            />
          }
        </div>
        <ListView />
      </div>
      {selectEvent === null ?
        <></> :
        <MapPopup
          mapViewport={mapContainerRef.current?.getBoundingClientRect()}
          featureX={selectEvent?.data?.windowPoint.x}
          featureY={selectEvent?.data?.windowPoint.y}
          school={selectEvent?.data?.feature?.properties?.data}
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
