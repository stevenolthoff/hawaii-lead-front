import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useDataContext } from '@/Contexts/DataContext'
import { Map as AxiomMap, IGeoJSONLayerProps, ILayerQueryEvent, IStyleableMapProps } from '@axdspub/axiom-maps'
import { Input, Loader } from '@axdspub/axiom-ui-utilities'
import getLayer from '@/Services/MapLayer'
import MapPopup from '@/Components/MapPopup'

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { loading, data } = useDataContext()
  const [layer, setLayer] = useState<IGeoJSONLayerProps | undefined>(undefined)
  const [selectEvent, setSelectEvent] = useState<ILayerQueryEvent | null>(null)
  const [x, setX] = useState(0)
  // const [filteredSchools, setFilteredSchools] = useState<any[]>([])
  // const [map, setMap] = useState<ReactElement | null>(null)

  const MAP_CONFIG: IStyleableMapProps = {
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
        <div className='w-3/4 h-full' ref={mapContainerRef}>
          {layer === undefined ?
            <Loader /> :
            <AxiomMap
              {...MAP_CONFIG}
              layers={[layer]}
            />
          }
        </div>
        <div className='w-1/4'>
          {/* {filteredSchools.map((feature, i) => <div key={`thing-${i}`}>thing</div>)} */}
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
