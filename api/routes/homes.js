import express from "express";
import { getHomes, getSingleHome, makeHomeSold, updateOwner, getUsersHomes, updateOwnerName, updateGateCode, updateDoorCode } from "../controllers/homes.js";

const router = express.Router()

router.get("/getHomes", getHomes)
router.post("/getSingleHome", getSingleHome)
router.post("/makeHomeSold", makeHomeSold)
router.post("/updateOwner", updateOwner)
router.post("/getUsersHomes", getUsersHomes)
router.post("/updateOwnerName", updateOwnerName)
router.post("/updateGateCode", updateGateCode)
router.post("/updateDoorCode", updateDoorCode)

export default router