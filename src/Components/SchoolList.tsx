import React from 'react'
import { findJobId } from '@/Services/MapLayer'
import { useDataContext } from '@/Contexts/DataContext'
import SchoolSummaryCard from './SchoolSummaryCard'

const SchoolList = () => {
  const { filteredSchools } = useDataContext()

  if (filteredSchools === null) {
    return <></>
  } else {
    return (
      <div className='flex flex-col gap-2 py-4'>
        {Object.keys(filteredSchools).map(schoolName => (
          <div
            key={`school-summary-card-${schoolName}`}
            className='hover:bg-slate-200 hover:cursor-pointer border
            rounded-md px-4 py-2'
          >
            <SchoolSummaryCard
              schoolName={schoolName}
              school={{
                id: findJobId(filteredSchools[schoolName]),
                school: schoolName,
                fixtures: filteredSchools[schoolName]
              }}
            />
          </div>
        ))}
      </div>
    )
  }
}
 
export default SchoolList
