import express from "express";
import { createChat, getUserChats, deleteChat, getChatById, renameGroupChat, removeParticipantsFromGroup, addParticipantsToGroup } from "../Controllers/ChatController.js";

const router = express.Router();


router.post("/", createChat);

router.get("/user/:userId", getUserChats);

router.get("/:chatId", getChatById);

router.delete("/:chatId", deleteChat);

router.post("/:chatId/rename", renameGroupChat);

router.patch("/:chatId/groupremove", removeParticipantsFromGroup);

router.patch("/:chatId/groupadd", addParticipantsToGroup);

export default router;
