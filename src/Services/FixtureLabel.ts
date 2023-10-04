// I'm guessing what any of these are. Verify.
export function getFixtureLabel (fixtureType: string) {
  if (fixtureType === 'BF') {
    return 'Bathroom'
  } else if (fixtureType === 'CF') {
    return 'Class'
  } else if (fixtureType === 'DF') {
    return 'Drinking'
  } else if (fixtureType === 'KF') {
    return 'Kitchen'
  } else if (fixtureType === 'KPF') {
    return 'Kitchen Potable'
  } else if (fixtureType === 'NS') {
    return 'NS'
  } else {
    return fixtureType
  }
}
