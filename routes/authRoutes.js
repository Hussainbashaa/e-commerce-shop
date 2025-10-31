import express from "express";
import { loginUser } from "../controllers/Auth/login.js";

const router = express.Router();

router.post("/user/login", loginUser);

export default router;
