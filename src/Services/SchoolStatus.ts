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

export {
  getNumCompleteFixtures,
  getNumInProgressFixtures
}
