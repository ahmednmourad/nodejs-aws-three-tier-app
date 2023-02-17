import request from "supertest"
import app from "../../app.js"

describe("Health Service", () => {
  describe("Check server health", () => {
    it("When server is running it should return 200 status code", async () => {
      const res = await request(app).get("/health")

      expect(res.statusCode).toEqual(200)
    })
  })
})
