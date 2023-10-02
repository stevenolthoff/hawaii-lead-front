import React, { useEffect, useState, ReactElement, useRef } from 'react'
import StatusBubble from '@/Components/StatusBubble'

const BubbleLegend = () => {
  return (
    <div className='text-xs font-semibold text-slate-500 flex justify-between'>
      <div className='flex gap-2 items-center'>
        <StatusBubble status='Not Started' />
        <span>Not Started</span>
      </div>
      <div className='flex gap-2 items-center'>
        <StatusBubble status='In Progress' />
        <span>In Progress</span>
      </div>
      <div className='flex gap-2 items-center'>
        <StatusBubble status='Completed' />
        <span>Completed</span>
      </div>
    </div>
  )
}

export default BubbleLegend
