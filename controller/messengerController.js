const User = require("../models/authModel");
const messageModel = require("../models/messageModel");
const { formidable } = require("formidable");
const fs = require("fs");

module.exports.getFriends = async (req, res) => {
  const myId = req.myId;
  try {
    const friendGet = await User.find({});
    const filter = friendGet.filter((d) => d.id !== myId);
    res.status(200).json({ success: true, friends: filter });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Sever Error",
      },
    });
  }
};

const updateStatusMessage = async (myId, fdId, status) => {
  try {
    const updateMessages = await messageModel.updateMany(
      { senderId: fdId, receiverId: myId, status: { $ne: status } },
      { $set: { status: status } }
    );
    return true;
  } catch (error) {
    return error;
  }
};

module.exports.messageGet = async (req, res) => {
  const myId = req.myId;
  const fdId = req.params.id;
  const { status } = req.body;

  try {
    let isUpdated;
    if (status) isUpdated = await updateStatusMessage(myId, fdId, status);
    let getAllMessages = await getMessages(myId, fdId);

    res.status(200).json({
      success: true,
      message: getAllMessages,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Server error",
      },
    });
  }
};

const getMessages = async (myId, fdId) => {
  try {
    let getAllMessages = await messageModel.find({
      $or: [
        { senderId: myId, receiverId: fdId },
        { senderId: fdId, receiverId: myId },
      ],
    });
    return getAllMessages;
  } catch (error) {
    return error;
  }
};

const getLastMessage = async (myId, fdId) => {
  const msg = await messageModel
    .findOne({
      $or: [
        {
          $and: [
            {
              senderId: {
                $eq: myId,
              },
            },
            {
              receiverId: {
                $eq: fdId,
              },
            },
          ],
        },
        {
          $and: [
            {
              senderId: {
                $eq: fdId,
              },
            },
            {
              receiverId: {
                $eq: myId,
              },
            },
          ],
        },
      ],
    })
    .sort({
      updatedAt: -1,
    });
  return msg;
};

module.exports.getFriendsLastMsg = async (req, res) => {
  const myId = req.myId;
  let fnd_msg = [];
  try {
    const friendGet = await User.find({
      _id: {
        $ne: myId,
      },
    });
    for (let i = 0; i < friendGet.length; i++) {
      let lmsg = await getLastMessage(myId, friendGet[i].id);
      fnd_msg.push({
        _id: friendGet[i]._id,
        userName: friendGet[i].userName,
        email: friendGet[i].email,
        image: friendGet[i].image,
        createdAt: friendGet[i].createdAt,
        updatedAt: friendGet[i].updatedAt,
        msgInfo: lmsg,
      });
    }

    res.status(200).json({ success: true, friends: fnd_msg });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Sever Error",
      },
    });
  }
};

module.exports.messageSeen = async (req, res) => {
  const messageId = req.body._id;

  await messageModel
    .findByIdAndUpdate(messageId, {
      status: "seen",
    })
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch(() => {
      res.status(500).json({
        error: {
          errorMessage: "Internal Server Error",
        },
      });
    });
};

module.exports.storeMessage = (req, res) => {
  const form = formidable({});
  const senderId = req.myId;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({
        error: {
          errorMessage: "Form parsing failed",
        },
      });
    }

    const { senderName, receiverId, text, imageName } = fields;
    const image = files.image;

    // Check if there's an image and text in the request
    if (image && image.length > 0) {
      const newPath = `/home/slavkososic/Desktop/Practices/ChatWithMe/ChatWithMe-frontend/public/images/${imageName}`;
      files.image[0].originalFilename = imageName[0];

      fs.copyFile(files.image[0].filepath, newPath, async (err) => {
        if (err) {
          return res.status(500).json({
            error: {
              errorMessage: "Image upload failed",
            },
          });
        } else {
          // Save message with image

          try {
            const insertMessage = await messageModel.create({
              senderId: senderId,
              senderName: senderName[0],
              receiverId: receiverId[0],
              message: {
                text: text && text[0] ? text[0] : "",
                image: files.image[0].originalFilename,
              },
            });
            return res.status(201).json({
              success: true,
              message: insertMessage,
            });
          } catch (error) {
            console.log("opaa", error);
            return res.status(500).json({
              error: {
                errorMessage: "Internal Server Error",
              },
            });
          }
        }
      });
    } else {
      try {
        const insertMessage = await messageModel.create({
          senderId: senderId,
          senderName: senderName[0],
          receiverId: receiverId[0],
          message: {
            text: text[0] || "",
            image: "",
          },
        });
        return res.status(201).json({
          success: true,
          message: insertMessage,
        });
      } catch (error) {
        console.log("opa 2", error);
        return res.status(500).json({
          error: {
            errorMessage: "Internal Server Error",
          },
        });
      }
    }
  });
};
