import morgan from "morgan"

const format = JSON.stringify({
  date: ":date[iso]",
  url: ":url",
  method: ":method",
  status: ":status",
  responseTime: ":response-time",
  totalTime: ":total-time[3]",
})

const httpLogger = morgan(format, {
  stream: {
    write: (message) => {
      const { method, url, status, responseTime, date, totalTime } = JSON.parse(message)

      logger.info("HTTP Access Log", {
        timestamp: date,
        url,
        method,
        status: Number(status),
        responseTime: Number(responseTime),
        totalTime: Number(totalTime),
      })
    },
  },
})

export { httpLogger }
