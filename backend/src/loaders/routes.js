import { Router } from "express"
import healthRouter from "../api/health/health.route.js"
import userRouter from "../api/user/user.route.js"
import authRouter from "../api/auth/auth.route.js"

const router = Router()

router.use("/health", healthRouter)
router.use("/users", userRouter)
router.use("/auth", authRouter)

export default router
