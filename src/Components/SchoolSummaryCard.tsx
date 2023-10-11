import * as React from 'react'
import StatusBubble from '@/Components/StatusBubble'
import { useDataContext } from '@/Contexts/DataContext'
import { getNumCompleteFixtures, getNumInProgressFixtures, getStatusFromCounts } from '@/Services/SchoolStatus'
import { useMapPreviewContext } from '@/Contexts/MapPreviewContext'
import { useSchoolContext } from '@/Contexts/SchoolContext'
import { ISchool, findCoordinates } from '@/Services/MapLayer'

interface ISchoolSummaryCardProps {
  schoolName: string
  school: ISchool
}

const SchoolSummaryCard = ({ schoolName, school }: ISchoolSummaryCardProps) => {
  const { filteredSchools } = useDataContext()
  const { selectSchool } = useSchoolContext()
  const { setSchoolToPreview, setPreviewCoordinates } = useMapPreviewContext()
  if (filteredSchools === null) {
    return <></>
  }
  const fixtures = filteredSchools[schoolName]
  const { island, district } = fixtures[0]
  const total = fixtures.length
  const numInProgress = getNumInProgressFixtures(fixtures)
  const numComplete = getNumCompleteFixtures(fixtures)
  const numNotStarted = total - numInProgress - numComplete
  return (
    <div
      className='w-full'
      onClick={() => selectSchool(school.id)}
      onMouseEnter={() => {
        setSchoolToPreview(school)
        setPreviewCoordinates(findCoordinates(school.fixtures))
      }}
      onMouseLeave={() => {
        setSchoolToPreview(null)
        setPreviewCoordinates(null)
      }}
    >
      <div className='flex justify-between'>
        <p className='font-semibold leading-tight'>{schoolName}</p>
        <StatusBubble status={getStatusFromCounts(total, numComplete, numInProgress, numNotStarted)} />
      </div>
      <p className='text-xs text-slate-500'>{island} / {district} </p>
      <table className='w-full text-xs leading-tight'>
        <tbody>
          <tr>
            <td></td><td className='text-right'>Fixtures</td>
          </tr>
          <tr className='bg-slate-200'>
            <td>Not Started</td><td className='text-right'>{numNotStarted} / {total}</td>
          </tr>
          <tr>
            <td>In Progress</td><td className='text-right'>{numInProgress} / {total}</td>
          </tr>
          <tr className='bg-slate-200'>
            <td>Completed</td><td className='text-right'>{numComplete} / {total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
 
export default SchoolSummaryCard
