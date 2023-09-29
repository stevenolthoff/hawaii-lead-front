import { ProgressStatus } from '@/Contexts/DataContext'
import TestData from '@/data.json'

type Fixtures = typeof TestData.data

function getNumCompleteFixtures (fixtures: Fixtures): number {
  return fixtures.reduce((sum, fixture) =>
    fixture['released_for_unrestricted_use?'] === 'Yes' ? ++sum : sum, 0)
}

function getNumInProgressFixtures (fixtures: Fixtures): number {
  return fixtures.reduce((sum, fixture) =>
    fixture['released_for_unrestricted_use?'] !== 'Yes' &&
    fixture.date_replaced !== null
      ? ++sum : sum, 0)
}

function getColorForStatus (status: ProgressStatus): string {
  if (status === 'Not Started') {
    return '#ef4444'
  } else if (status === 'In Progress') {
    return '#eab308'
  } else if (status === 'Completed') {
    return '#22c55e'
  } else {
    return 'blue'
  }
}

function getStatusFromCounts (total: number, completed: number, inProgress: number, notStarted: number): ProgressStatus {
  if (completed === total) return 'Completed'
  if (notStarted === total) return 'Not Started'
  return 'In Progress'
}

export {
  getNumCompleteFixtures,
  getNumInProgressFixtures,
  getColorForStatus,
  getStatusFromCounts
}
