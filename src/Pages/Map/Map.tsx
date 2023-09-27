import React, { useEffect, useRef, useState } from 'react'
import { useDataContext } from '@/Contexts/DataContext'
import { Map as AxiomMap, IGeoJSONLayerProps, ILayerQueryEvent, IMap, IStyleableMapProps } from '@axdspub/axiom-maps'
import { Input, Loader } from '@axdspub/axiom-ui-utilities'
import getLayer from '@/Services/MapLayer'
import MapFilters from '@/Components/MapFilters'
import MapPopup from '@/Components/MapPopup'
import MapSidebar from '@/Components/MapSidebar'

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { data, filteredSchools, filterByText } = useDataContext()
  const [map, setMap] = useState<IMap | undefined>(undefined)
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

  const updateLayerWithFilteredData = () => {
    if (data === null) return
    const dataToUse = filteredSchools === null ? data.bySchool : filteredSchools
    const newLayer = getLayer(dataToUse)
    newLayer.onMouseOver = setSelectEvent
    newLayer.onMouseOut = () => {
      newLayer.implementation?.unsetSelectedFeature()
      setSelectEvent(null)
    }
    setLayer(newLayer)
  }

  useEffect(updateLayerWithFilteredData, [data, filteredSchools])

  useEffect(() => {
    if (layer !== undefined) map?.reloadLayers([layer])
  }, [layer])

  return (
    <div className='w-full max-w-full h-full max-h-full flex flex-col'>
      <div className='h-[6rem] max-h-[6rem] flex flex-col divide-y border-b border-slate-200'>
        <div className='flex px-4 py-2 w-full text-center'>
          <img src='/DOH-Logo-with-text-circling.png' width='40' />
          <div className='px-4 py-2 font-semibold text-slate-800 text-center w-full'>Hawaii Lead Water Monitor</div>
        </div>
        <MapFilters />
      </div>
      <div className='flex h-[calc(100%-6rem)] max-h-[calc(100%-6rem)]'>
        <div className='w-3/4' ref={mapContainerRef}>
          {layer === undefined ?
            <Loader /> :
            <AxiomMap
              {...MAP_CONFIG}
              setState={setMap}
              layers={[layer]}
            />
          }
        </div>
        <div className='w-1/4 max-h-full'>
          <MapSidebar />
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
