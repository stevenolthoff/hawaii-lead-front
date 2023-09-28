import React from 'react'
import SchoolList from '@/Components/SchoolList'
import RollupStats from '@/Components/RollupStats'
import { useDataContext } from '@/Contexts/DataContext'
import { Loader } from '@axdspub/axiom-ui-utilities'
import { Transition } from '@headlessui/react'

const MapSidebar = () => {
  const { data } = useDataContext()

  return (
    <div className='h-full'>
      { data === null ?
        <div className='h-full flex justify-center items-center animate-pulse'>
          <Loader />
        </div> : <></>  
      }
      <Transition
        show={data !== null}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className='h-full scrollbox shadow-xl'
      >
        <div className='max-h-full h-full px-4 py-2 text-sm'>
          <div className=''>
            <RollupStats />
          </div>
          <div className=''>
            <SchoolList />
          </div>
        </div>
      </Transition>
    </div>
  )
  
}
 
export default MapSidebar
