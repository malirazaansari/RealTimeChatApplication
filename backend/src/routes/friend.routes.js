import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendsList,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.post("/send-request", sendFriendRequest);
router.post("/accept-request", acceptFriendRequest);
router.get("/:userId", getFriendsList);

export default router;
