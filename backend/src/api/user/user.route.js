import { Router } from "express"
import { isAuth, validateSchema } from "../../middlewares/index.js"
import * as validations from "./user.validation.js"
import * as userController from "./user.controller.js"

const router = Router()

router
  .post("/", validateSchema(validations.createUserSchema.body), userController.create)
  .get("/me", isAuth, userController.getCurrentUser)
  .get("/:userId", userController.getById)
  .put("/", isAuth, validateSchema(validations.updateUserSchema.body), userController.update)
  .delete("/", isAuth, userController.remove)

export default router
