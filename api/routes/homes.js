import express from "express";
import { getHomes, getSingleHome, makeHomeSold } from "../controllers/homes.js";

const router = express.Router()

router.get("/getHomes", getHomes)
router.post("/getSingleHome", getSingleHome)
router.post("/makeHomeSold", makeHomeSold)

export default router