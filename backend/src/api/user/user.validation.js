export const createUserSchema = {
  body: {
    type: "object",
    required: ["firstName", "lastName", "email", "password"],
    additionalProperties: false,
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
  },
}

export const updateUserSchema = {
  body: {
    type: "object",
    minProperties: 1,
    additionalProperties: false,
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      email: { type: "string", format: "email" },
      picture: { type: "string" },
    },
  },
}
