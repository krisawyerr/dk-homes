import express from "express";
import { getHomes, getSingleHome, makeHomeSold, updateOwner, getUsersHomes } from "../controllers/homes.js";

const router = express.Router()

router.get("/getHomes", getHomes)
router.post("/getSingleHome", getSingleHome)
router.post("/makeHomeSold", makeHomeSold)
router.post("/updateOwner", updateOwner)
router.post("/getUsersHomes", getUsersHomes)

export default router