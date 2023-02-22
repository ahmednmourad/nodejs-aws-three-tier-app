export const verifyEmail = {
  body: {
    type: "object",
    required: ["email", "code"],
    additionalProperties: false,
    properties: {
      email: { type: "string", format: "email" },
      code: { type: "string" },
    },
  },
}

export const login = {
  body: {
    type: "object",
    required: ["email", "password"],
    additionalProperties: false,
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
  },
}

export const forgotPassword = {
  body: {
    type: "object",
    required: ["email"],
    additionalProperties: false,
    properties: {
      email: { type: "string", format: "email" },
    },
  },
}

export const resetPassword = {
  body: {
    type: "object",
    required: ["token", "password"],
    additionalProperties: false,
    properties: {
      token: { type: "string" },
      password: { type: "string" },
    },
  },
}

export const changePassword = {
  body: {
    type: "object",
    required: ["oldPassword", "newPassword"],
    additionalProperties: false,
    properties: {
      oldPassword: { type: "string" },
      newPassword: { type: "string" },
    },
  },
}

export const refreshToken = {
  body: {
    type: "object",
    required: ["refreshToken"],
    additionalProperties: false,
    properties: {
      refreshToken: { type: "string" },
    },
  },
}

export const otp = {
  query: {
    required: ["email"],
    additionalProperties: false,
    properties: {
      email: { type: "string", format: "email" },
    },
  },
}

export const passwordlessLogin = {
  body: {
    type: "object",
    required: ["email", "otp"],
    additionalProperties: false,
    properties: {
      email: { type: "string", format: "email" },
      otp: { type: "string" },
    },
  },
}
