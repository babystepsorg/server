const getWeekNumber = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const startOfWeek = new Date(
    startOfYear.setDate(startOfYear.getDate() - startOfYear.getDay() + 1)
  )
  const diff = date.getTime() - startOfWeek.getTime()
  const weekNumber = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7))
  return weekNumber
}
