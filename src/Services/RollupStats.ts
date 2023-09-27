import { ProgressStatus, Schools } from '@/Contexts/DataContext'
import { getProgress } from '@/Services/MapLayer'

function getStats (schools: Schools) {
  const stats: Record<ProgressStatus, number> = {
    'Completed': 0,
    'In Progress': 0,
    'Not Started': 0
  }
  Object.keys(schools).forEach(school => {
    const fixtures = schools[school]
    const progress = getProgress(fixtures)
    if (progress in stats) stats[progress] += 1
    else stats[progress] = 1
  })
  return stats
}

export {
  getStats
}
