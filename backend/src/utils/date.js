export const addToCurrentDate = (value, unit) => {
  const date = new Date()

  if (unit === "year" || unit === "years") {
    date.setFullYear(date.getFullYear() + value)
  } else if (unit === "hour" || unit === "hours") {
    date.setHours(date.getHours() + value)
  } else if (unit === "minute" || unit === "minutes") {
    date.setMinutes(date.getMinutes() + value)
  } else if (unit === "second" || unit === "seconds") {
    date.setSeconds(date.getSeconds() + value)
  }

  return date
}
