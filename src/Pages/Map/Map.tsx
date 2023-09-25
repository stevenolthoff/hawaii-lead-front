import React, { useEffect, useRef, useState } from 'react'
import { useDataContext } from '@/Contexts/DataContext'
import { Map as AxiomMap, IGeoJSONLayerProps, ILayerQueryEvent, IStyleableMapProps } from '@axdspub/axiom-maps'
import { Input, Loader } from '@axdspub/axiom-ui-utilities'
import getLayer from '@/Services/MapLayer'
import MapPopup from '@/Components/MapPopup'
import SchoolList from '@/Components/SchoolList'

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { data } = useDataContext()
  const [layer, setLayer] = useState<IGeoJSONLayerProps | undefined>(undefined)
  const [selectEvent, setSelectEvent] = useState<ILayerQueryEvent | null>(null)

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

  useEffect(() => {
    if (data !== null) {
      const newLayer = getLayer(data.bySchool)
      newLayer.onMouseOver = setSelectEvent
      newLayer.onMouseOut = () => {
        newLayer.implementation?.unsetSelectedFeature()
        setSelectEvent(null)
      }
      setLayer(newLayer)
    }
  }, [data])

  return (
    <div className='w-full max-w-full h-full max-h-full flex flex-col'>
      <div className='h-[5rem] max-h-[5rem]'>
        <div className=''>Hawaii Lead Water Monitor</div>
        <div className='flex gap-2'>
          <Input
            id='test'
            testId='test'
            placeholder='Search schools'
          />
          <div>dropdown</div>
          <div>dropdown</div>
        </div>
      </div>
      <div className='flex h-[calc(100%-5rem)] max-h-[calc(100%-5rem)]'>
        <div className='w-3/4' ref={mapContainerRef}>
          {layer === undefined ?
            <Loader /> :
            <AxiomMap
              {...MAP_CONFIG}
              layers={[layer]}
            />
          }
        </div>
        <div className='w-1/4 max-h-full'>
          <SchoolList />
        </div>
      </div>
      <MapPopup
        mapViewport={mapContainerRef.current?.getBoundingClientRect()}
        featureX={selectEvent?.data?.windowPoint.x}
        featureY={selectEvent?.data?.windowPoint.y}
        school={selectEvent?.data?.feature?.properties?.data}
      />
    </div>
  )
}

export default Map
