import { Router } from "express"
import { upload as uploadController } from "./upload.controller.js"
import { isAuth, upload as uploadMiddleware } from "../../middlewares/index.js"

const router = Router()

router.post("/", isAuth, uploadMiddleware.single("file"), uploadController)

export default router
