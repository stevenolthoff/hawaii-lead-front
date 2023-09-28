import React from 'react'
import { ProgressStatus } from '@/Contexts/DataContext'
import { getColorForStatus } from '@/Services/SchoolStatus'

interface IStatusBubbleProps {
  status: ProgressStatus
}

const StatusBubble = ({ status }: IStatusBubbleProps) => {
  return (
    <div
      className='w-3 h-3 bg-slate-100 rounded-full'
      style={{
        backgroundColor: getColorForStatus(status)
      }}
    >
    </div>
  )
}
 
export default StatusBubble
