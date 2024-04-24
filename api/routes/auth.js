import express from "express";
import { logout, authenticate } from "../controllers/auth.js";

const router = express.Router()

router.post("/authenticate", authenticate)
router.post("/logout", logout)

export default router