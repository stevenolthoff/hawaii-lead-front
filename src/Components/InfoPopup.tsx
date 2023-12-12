import { Button } from '@axdspub/axiom-ui-utilities'
import { XMarkIcon } from '@heroicons/react/24/solid'
import React, { ReactElement, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

const InfoPopup = ({ onClose }: { onClose: () => void }) => {
  const ref = useRef(null)
  useOnClickOutside(ref, onClose)
  return (
    <div className='fixed z-50 place-self-center w-full h-full flex justify-center items-center bg-slate-800/25 hover:cursor-pointer'>
      <div className='bg-slate-100 shadow-xl w-4/5 max-h-3/4 lg:w-1/3 flex flex-col rounded-md hover:cursor-default' ref={ref}>
        <div className='w-full flex justify-between items-center border-b px-4'>
          <div className='w-12'></div>
          <div className='p-4 font-semibold text-slate-800'>Overview</div>
          <XMarkIcon className='w-12 h-12 text-slate-800 hover:cursor-pointer' onClick={onClose} />
        </div>
        <div className='overflow-y-scroll w-full h-full p-4 no-scrollbar flex flex-col justify-between gap-8'>
          <div>
            <p>
              The State of Hawaii Departments of Health and Education are 
              replacing water infrastructure in schools across the state.
              In this tool, you can track the replacement status of water
              fixtures.
              Only fixtures that tested with an initial lead content greater
              than 5 parts per billion (PPB) are listed.
            </p>
            <br/>
            <div>
              <p className='font-semibold'>Meaning of Fixture Statuses</p>
              <ol className='list-none list-inside'>
                <li><span className='text-slate-100 bg-red-500 rounded-lg px-2'>Not Started</span> indicates fixtures that are in need of replacement, but have not yet begun the replacement process.</li>
                <li><span className='text-slate-100 bg-yellow-500 rounded-lg px-2'>In Progress</span> indicates that a replacement is underway.</li>
                <li><span className='text-slate-100 bg-green-500 rounded-lg px-2'>Completed</span> indicates a completed replacement. 
                After replacement, some fixtures may be listed for non-potable use only. 
                Other fixtures will require 30 seconds of flushing prior to drinking.
                This information and more is listed under each fixture.</li>
              </ol>
            </div>
          </div>
          <Button className='bg-slate-100 border-slate-800 hover:bg-slate-200 active:bg-slate-300' onClick={onClose}>OK</Button>
        </div>
      </div>
    </div>
  )
}
export default InfoPopup
