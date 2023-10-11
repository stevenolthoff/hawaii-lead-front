import React, { ReactElement, useState } from 'react'

interface IImageProps {
  src?: string
}
const Image = ({ src }: IImageProps) => {
  const [successfullyLoaded, setSuccessfullyLoaded] = useState<boolean | undefined>(undefined)
  const showLoadingState = src === null || successfullyLoaded === false || successfullyLoaded === undefined
  const onClick = () => {
    if (successfullyLoaded && src !== undefined && src !== null && window !== undefined && window !== null) {
      window.open(src, '_blank')!.focus()
    }
  }
  return (
    <div className='w-6 h-6'>
      <div
        className='w-full h-full bg-slate-200 rounded-md cursor-not-allowed'
        style={{
          visibility: showLoadingState ? 'visible' : 'hidden',
          height: showLoadingState ? '' : '0',
          animation: successfullyLoaded ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : ''
        }}
        title='No image available'
      >
      </div>
      <img
        className='w-full h-full rounded-md hover:border-blue-500 hover:border-2 object-cover'
        style={{
          visibility: successfullyLoaded ? 'visible' : 'hidden'
        }}
        src={src}
        onLoad={() => { setSuccessfullyLoaded(true) }}
        onError={() => { setSuccessfullyLoaded(false) }}
        onClick={onClick}
      />
    </div>
  )
}

export default Image
