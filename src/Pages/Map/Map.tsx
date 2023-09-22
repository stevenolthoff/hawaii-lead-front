import React, { useRef, useState } from 'react'
import { Map as AxiomMap, ILayerQueryEvent, IStyleableMapProps } from '@axdspub/axiom-maps'
import { Input } from '@axdspub/axiom-ui-utilities'
import getLayer from '@/Services/MapLayer'
import MapPopup from '@/Components/MapPopup'

const Map = () => {
  const layer = getLayer()
  const mapConfig: IStyleableMapProps = {
    baseLayerKey: 'hybrid',
    mapLibraryKey: 'leaflet',
    height: '100%',
    width: '100%',
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

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [selectEvent, setSelectEvent] = useState<ILayerQueryEvent | null>(null)

  const unselectFeature = () => {
    layer.implementation?.unsetSelectedFeature()
    setSelectEvent(null)
  }
  layer.onClickOutsideLayer = unselectFeature
  layer.onMouseOver = setSelectEvent
  layer.onMouseOut = unselectFeature
  const onMapMoveStart = unselectFeature
  
  return (
    <div className='w-full h-full flex flex-col'>
      <div>
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
      <div className='grow flex'>
        <div className='w-full h-full' ref={mapContainerRef}>
          <AxiomMap
            {...mapConfig}
            onMapViewChange={onMapMoveStart}
            layers={[layer]}
          />
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
