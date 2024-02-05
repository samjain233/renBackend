import express from "express";
const router = express.Router();

import authRoutes from "./Auth/auth.routes.js";
import eventRoutes from "./Events/event.routes.js";

router.use("/auth", authRoutes);
router.use("/events",eventRoutes);

export default router;
