const router = require("express").Router();
const {
  getFriends,
  messageUploadDB,
  messageGet,
  getFriendsLastMsg,
} = require("../controller/messengerController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/get-friends", authMiddleware, getFriends);
router.post("/send-message", authMiddleware, messageUploadDB);
router.put("/get-messages/:id", authMiddleware, messageGet);
router.get("/get-last-message", authMiddleware, getFriendsLastMsg);

module.exports = router;
