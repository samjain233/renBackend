import express from "express";
const router = express.Router();

import authRoutes from "./Auth/auth.routes.js";
import eventRoutes from "./Events/event.routes.js";
import registerRoutes from "./register/register.routes.js";

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/participate",registerRoutes);

export default router;
