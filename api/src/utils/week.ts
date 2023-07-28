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
    currentWeek = (currentWeek - createdAtWeek) + 1
    if (currentWeek > 4) {
      currentWeek = 4
    }
  }

  return currentWeek
}

export const getCurrentWeekFromConsiveDate = (consiveDate: string, createdAt: string) => {
  let createdAtWeek = getWeekNumber(new Date(createdAt))
  let consiveAtWeek = getWeekNumber(new Date(consiveDate))

  return (consiveAtWeek - createdAtWeek) + 1
}


export const getDaysOfWeekForWeek = (weekNumber: number, startDate: Date) => {
  const daysInWeek = 7;
  const daysOfWeek = [];

  // Calculate the start date of the specified week
  const targetWeekStart = new Date(startDate);
  targetWeekStart.setDate(startDate.getDate() + (weekNumber - 1) * daysInWeek);

  // Loop through each day of the week (0: Sunday, 1: Monday, ..., 6: Saturday)
  for (let i = 0; i < daysInWeek; i++) {
    const currentDate = new Date(targetWeekStart);
    currentDate.setDate(targetWeekStart.getDate() + i);
    daysOfWeek.push(currentDate);
  }

  return daysOfWeek;
}
