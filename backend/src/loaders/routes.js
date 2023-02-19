import { Router } from "express"
import healthRouter from "../api/health/health.route.js"
import userRouter from "../api/user/user.route.js"

const router = Router()

router.use("/health", healthRouter)
router.use("/users", userRouter)

export default router
