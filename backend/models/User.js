const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
});

// Static signup method
UserSchema.statics.signup = async function (email, password) {
  email = email.trim();
  password = password.trim();

  if (!email || !password) throw Error("All fields must be filled");
  if (!validator.isEmail(email)) throw Error("Invalid email");
  if (!validator.isStrongPassword(password))
    throw Error("Password must be at least 8 characters with uppercase, lowercase, numbers, and symbols");

  const exists = await this.findOne({ email });
  if (exists) throw Error("Email already in use");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hashedPassword });
  return { _id: user._id, email: user.email }; // Exclude password in response
};

// Static login method
UserSchema.statics.login = async function (email, password) {
  email = email.trim();
  password = password.trim();

  if (!email || !password) throw Error("All fields must be filled");

  const user = await this.findOne({ email });
  if (!user) throw Error("Incorrect email");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Error("Incorrect password");

  return { _id: user._id, email: user.email }; // Exclude password in response
};

module.exports = mongoose.model("User", UserSchema);
