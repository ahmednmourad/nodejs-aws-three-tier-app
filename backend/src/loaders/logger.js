import pino from "pino"
import rTracer from "cls-rtracer"

const logger = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
  enabled: process.env.LOG_ENABLED ? process.env.LOG_ENABLED === "true" : true,
  base: undefined,
  mixin: () => ({ requestId: rTracer.id() }),
  formatters: { level: (label) => ({ level: label.toUpperCase() }) },
  transport: { target: "pino-pretty", options: { colorize: true } },
  hooks: {
    logMethod(inputArgs, method) {
      if (inputArgs.length >= 2) {
        const arg1 = inputArgs.shift()
        const arg2 = inputArgs.shift()
        return method.apply(this, [arg2, arg1, ...inputArgs])
      }
      return method.apply(this, inputArgs)
    },
  },
})

global.logger = logger

export { logger }
