import { IFixture, ProgressStatus } from '@/Contexts/DataContext'

function getNumCompleteFixtures (fixtures: IFixture[]): number {
  return fixtures.reduce((sum, fixture) =>
    fixture.fixture_status !== null ? ++sum : sum, 0)
}

function getNumInProgressFixtures (fixtures: IFixture[]): number {
  return fixtures.reduce((sum, fixture) =>
    fixture.fixture_status === null &&
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
