// I'm guessing what any of these are. Verify.
export function getFixtureLabel (fixtureType: string) {
  if (fixtureType === 'BF') {
    return 'Bathroom'
  } else if (fixtureType === 'CF') {
    return 'Classroom'
  } else if (fixtureType === 'DF') {
    return 'Drinking'
  } else if (fixtureType === 'KF') {
    return 'Kitchen'
  } else if (fixtureType === 'KPF') {
    return 'Kitchen Pot'
  } else if (fixtureType === 'NS') {
    return 'Nurse Office'
  } else if (fixtureType === 'WC') {
    return 'Water Cooler'
  } else if (fixtureType === 'WBF') {
    return 'Water Bottle Filler'
  } else {
    return fixtureType
  }
}
