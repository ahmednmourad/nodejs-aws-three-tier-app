import { Router } from "express"
import { upload as uploadController } from "./upload.controller.js"
import { upload as uploadMiddleware } from "./upload.middleware.js"
import { isAuth } from "../../middlewares/index.js"

const router = Router()

router.post("/", isAuth, uploadMiddleware.single("file"), uploadController)

export default router
