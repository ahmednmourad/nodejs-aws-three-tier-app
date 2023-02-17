import { pluralize } from "../../utils/index.js"

export const check = () => {
  return {
    uptime: getUptime(),
    message: "Ok",
    date: new Date(),
  }
}

const getUptime = () => {
  const uptime = process.uptime()
  const date = new Date(uptime * 1000)
  const days = date.getUTCDate() - 1
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const seconds = date.getUTCSeconds()

  const segments = []

  if (days > 0) segments.push(`${days} ${pluralize(days, "day")}`)
  if (hours > 0) segments.push(`${hours} ${pluralize(hours, "hour")}`)
  if (minutes > 0) segments.push(`${minutes} ${pluralize(minutes, "minute")}`)
  if (seconds > 0) segments.push(`${seconds} ${pluralize(seconds, "second")}`)

  const dateString = segments.join(", ")
  return dateString
}
