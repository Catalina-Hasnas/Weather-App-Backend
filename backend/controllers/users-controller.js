const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  if (!email || !password) {
    const error = new HttpError("Email and Password are required fields.", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    email,
    password: hashedPassword,
    city: "",
    weatherAlerts: false,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { id: createdUser.id, email: createdUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    id: createdUser.id,
    email: createdUser.email,
    token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Loggin in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPasword = false;

  try {
    isValidPasword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Couldn't log you in. Please check your credentials and try again",
      401
    );
    return next(error);
  }

  if (!isValidPasword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Loging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    id: existingUser.id,
    email: existingUser.email,
    token,
  });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const userId = decodedToken.id;

  let user;
  try {
    user = await User.findById(userId).lean();
  } catch (err) {
    const error = new HttpError("Could not find user with this id.", 500);
    return next(error);
  }

  const userProps = Object.keys(user);
  const reqProps = Object.keys(req.body);

  const reqHasAdditionalProps = reqProps.filter(
    (property) => !userProps.includes(property)
  );

  if (reqHasAdditionalProps.length > 0) {
    const error = new HttpError(
      "You can only update already existing properties.",
      500
    );
    return next(error);
  }

  let updatedUser;
  try {
    updatedUser = await User.findOneAndUpdate(
      { id: userId },
      { ...req.body },
      { returnOriginal: false }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  res.status(200).json({ updatedUser: updatedUser });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
