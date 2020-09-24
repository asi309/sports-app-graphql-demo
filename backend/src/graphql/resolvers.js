const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

module.exports = {
  createUser: async ({ userInput }, req) => {
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User already exists');
      throw error;
    }
    const hashedPassword = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      password: hashedPassword,
      firstName: userInput.firstName,
      lastName: userInput.lastName,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  fetchUser: async ({ id }, req) => {
    const user = await User.findById(id);
    if (!user) {
      const error = new Error('User not found');
      throw error;
    }

    return { ...user._doc, _id: user._id.toString() };
  },
};
