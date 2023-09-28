import React from 'react'
import { useDataContext } from '@/Contexts/DataContext'
import { Loader } from '@axdspub/axiom-ui-utilities'
import SchoolSummaryCard from './SchoolSummaryCard'

const SchoolList = () => {
  const { filteredSchools } = useDataContext()

  if (filteredSchools === null) {
    return <></>
  } else {
    return (
      <div className='max-h-full flex flex-col gap-2'>
        {Object.keys(filteredSchools).map(schoolName => (
          <div
            key={`school-summary-card-${schoolName}`}
            className='hover:bg-slate-200 hover:cursor-pointer border
            rounded-md px-4 py-2'
          >
            <SchoolSummaryCard
              schoolName={schoolName}
            />
          </div>
        ))}
      </div>
    )
  }
}
 
export default SchoolList
