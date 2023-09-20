import React from 'react'
import { Map as AxiomMap, IStyleableMapProps } from '@axdspub/axiom-maps'
import { Input } from '@axdspub/axiom-ui-utilities'
import getLayer from '@/Services/MapLayer'

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
        <div className='w-2/3 h-full'>
          <AxiomMap
            {...mapConfig}
            layers={[layer]}
          />
        </div>
        <div className='w-1/3 h-full scrollbox'>Schools</div>
      </div>
    </div>
  )
}

export default Map
