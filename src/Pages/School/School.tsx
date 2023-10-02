import React, { MouseEvent, useEffect, useRef, useState } from 'react'

interface ISchoolProps {
  onClickOutside: (event: MouseEvent<HTMLDivElement>) => void
}

const School = ({ onClickOutside }: ISchoolProps) => {
  const onClickInside = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    event.preventDefault()
  }
  return (
    <div
      className='w-full max-w-full h-full max-h-full absolute z-20 flex justify-center shadow-2xl bg-slate-800/25'
      onClick={onClickOutside}
    >
      <div
        className='w-1/2 max-w-1/2 h-full max-h-full bg-slate-100'
        onClick={onClickInside}
      >
        School
      </div>
    </div>
  )
}

export default School
