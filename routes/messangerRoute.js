const router = require("express").Router();
const {
  getFriends,
  messageGet,
  getFriendsLastMsg,
  messageSeen,
  storeMessage,
} = require("../controller/messengerController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/get-friends", authMiddleware, getFriends);
router.put("/get-messages/:id", authMiddleware, messageGet);
router.get("/get-last-message", authMiddleware, getFriendsLastMsg);
router.post("/seen-message", authMiddleware, messageSeen);
router.post("/send-message-full", authMiddleware, storeMessage);
module.exports = router;
