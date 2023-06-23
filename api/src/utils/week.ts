export const getWeekNumber = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const startOfWeek = new Date(
    startOfYear.setDate(startOfYear.getDate() - startOfYear.getDay() + 1)
  )
  const diff = date.getTime() - startOfWeek.getTime()
  const weekNumber = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7))
  return weekNumber
}

export const getCurrentWeek = (stage: string, createdAt: string) => {
  const currentStage = stage
  const accountCreationData = createdAt
  // Also get the consieve date
  // const consiveDate = ''

  // based upon the stage and consiveDate get the current week
  let createdAtWeek = getWeekNumber(new Date(accountCreationData))
  let currentWeek = getWeekNumber(new Date())

  if (currentStage === 'pre-conception') {
    currentWeek = currentWeek - createdAtWeek
    if (currentWeek > 4) {
      currentWeek = 4
    }
  }

  return currentWeek
}
