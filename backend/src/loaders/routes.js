import { Router } from "express"
import healthRouter from "../api/health/health.route.js"
import userRouter from "../api/user/user.route.js"
import authRouter from "../api/auth/auth.route.js"
import uploadRouter from "../api/upload/upload.route.js"

const router = Router()

router.use("/health", healthRouter)
router.use("/users", userRouter)
router.use("/auth", authRouter)
router.use("/upload", uploadRouter)

export default router
