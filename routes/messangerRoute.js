const router = require("express").Router();
const {
  getFriends,
  messageUploadDB,
  messageGet,
  getFriendsLastMsg,
  messageSeen,
  ImageMessageSend,
} = require("../controller/messengerController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/get-friends", authMiddleware, getFriends);
router.post("/send-message", authMiddleware, messageUploadDB);
router.put("/get-messages/:id", authMiddleware, messageGet);
router.get("/get-last-message", authMiddleware, getFriendsLastMsg);
router.post("/seen-message", authMiddleware, messageSeen);
router.post("/image-message-send", authMiddleware, ImageMessageSend);
module.exports = router;
