import React from 'react'

const KEY_NAME_ESC = 'Escape'
const KEY_EVENT_TYPE = 'keyup'
 
export default function useEscapeKey(handleClose: any) {
  const handleEscKey = React.useCallback((event: any) => {
    if (event.key === KEY_NAME_ESC) {
      handleClose()
    }
  }, [handleClose])
 
  React.useEffect(() => {
    document.addEventListener(KEY_EVENT_TYPE, handleEscKey, false)
 
    return () => {
      document.removeEventListener(KEY_EVENT_TYPE, handleEscKey, false)
    }
  }, [handleEscKey])
}
