const { formidable } = require("formidable");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const registerModel = require("../models/authModel");
const fs = require("fs");
const bcrypt = require("bcrypt");

module.exports.userRegister = (req, res) => {
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    // presented as arrays...
    const { userName, email, password, confirmPassword } = fields;
    const { image } = files;

    const error = [];
    if (!userName) {
      error.push("Please provide your user name");
    }
    if (!email) {
      error.push("Please provide your Email");
    }
    if (email && !validator.isEmail(email[0])) {
      error.push("Please provide your Valid Email");
    }
    if (!password) {
      error.push("Please provide your Password");
    }
    if (!confirmPassword) {
      error.push("Please provide your confirm Password");
    }
    if (password && confirmPassword && password[0] !== confirmPassword[0]) {
      error.push("Your Password and Confirm Password not same");
    }
    if (password && password[0].length < 6) {
      error.push("Please provide password must be 6 characters");
    }

    if (Object.keys(files).length === 0) {
      error.push("Please provide user image");
    }

    // check the errors... if there return the message, otherwise continue
    if (error.length > 0) {
      res.status(400).json({
        error: {
          errorMessage: error,
        },
      });
    } else {
      const getImageName = image[0].originalFilename;
      const currentDateInMs = Date.now(); // Get current date in milliseconds
      const randNumber = Math.floor(Math.random() * 9999); // Generate a random number between 0 and 9999
      const regex = /^(.*)\.([^.]*)$/;
      const info = String(getImageName).match(regex);
      const newImageName = `${currentDateInMs}-${randNumber}-${info[1]}.${info[2]}`;
      files.image[0].originalFilename = newImageName;

      const newPath = __dirname + `/public/${files.image[0].originalFilename}`;
      try {
        const findUser = await registerModel.findOne({
          email: email,
        });
        if (findUser) {
          res.status(404).json({
            error: {
              errorMessage: ["Your email already exists"],
            },
          });
        } else {
          fs.copyFile(image[0].filepath, newPath, async (error) => {
            if (!error) {
              const userCreate = await registerModel.create({
                userName: userName[0],
                email: email[0],
                password: await bcrypt.hash(password[0], 10),
                image: files.image[0].originalFilename,
              });

              const token = jwt.sign(
                {
                  id: userCreate._id,
                  email: userCreate.email,
                  userName: userCreate.userName,
                  image: userCreate.image,
                  registerTime: userCreate.createdAt,
                },
                process.env.SECRET,
                {
                  expiresIn: process.env.TOKEN_EXP,
                }
              );

              const options = {
                expires: new Date(
                  Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
                ),
              };
              res.status(201).cookie("authToken", token, options).json({
                successMessage: "Your registration was successful",
                token,
              });
            } else if (error) {
              console.log("ima li eroora", error);
              return res.status(500).json({
                error: {
                  errorMessage: ["Unsuccessfuly profile store action..."],
                },
              });
            }
          });
        }
      } catch (error) {
        res.status(500).json({
          error: {
            errorMessage: ["Interanl Server Error"],
          },
        });
      }
    }
  });
};

// user login controller
module.exports.userLogin = async (req, res) => {
  const errors = [];
  const { email, password } = req.body;

  if (!email) errors.push("Please provide your Email");
  if (!password) errors.push("Please provide your Password");
  if (email && !validator.isEmail(email)) {
    error.push("Please provide your Valid Email");
  }
  if (errors.length > 0)
    return res.status(400).json({
      error: {
        errorMessage: errors,
      },
    });

  const findUser = await registerModel
    .findOne({ email: email })
    .select("+password");

  if (!findUser)
    return res.status(404).json({
      error: {
        errorMessage: ["User not found"],
      },
    });

  if (!(await bcrypt.compare(password, findUser.password)))
    return res.status(401).json({
      error: {
        errorMessage: ["Bad password"],
      },
    });

  const token = jwt.sign(
    {
      id: findUser._id,
      email: findUser.email,
      userName: findUser.userName,
      image: findUser.image,
      registerTime: findUser.createdAt,
    },
    process.env.SECRET,
    {
      expiresIn: process.env.TOKEN_EXP,
    }
  );
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
    ),
  };

  res.status(200).cookie("authToken", token, options).json({
    successMessage: "Your Login Successful",
    token,
  });
};
