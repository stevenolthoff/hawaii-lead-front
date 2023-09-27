import * as React from 'react'
import { useDataContext } from '@/Contexts/DataContext'
import { Loader } from '@axdspub/axiom-ui-utilities'

const SchoolList = () => {
  const { filteredSchools } = useDataContext()

  if (filteredSchools === null) {
    return <Loader />
  } else {
    return (
      <div className='max-h-full'>
        {Object.keys(filteredSchools).map(schoolName => (
          <div key={`school-${schoolName}`}>
            {schoolName}
          </div>
        ))}
      </div>
    )
  }
}
 
export default SchoolList
