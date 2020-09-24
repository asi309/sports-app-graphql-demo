const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();

module.exports = {
  async store(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(200).json({
          message: 'Required field missing',
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(200).json({
          message:
            'Email or Password doesnot match. Do you want to register instead?',
        });
      }

      if (user && (await bcrypt.compare(password, user.password))) {
        const userResponse = {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        };

        return jwt.sign(
          { user: userResponse },
          process.env.SESSION_SECRET,
          (error, token) =>
            res.json({
              user: token,
              user_id: userResponse._id,
            })
        );
        // return res.json(userResponse)
      } else {
        return res.status(200).json({
          message:
            'Email or Password doesnot match. Do you want to register instead?',
        });
      }
    } catch (error) {
      throw Error(`Error while authenticating user - ${error}`);
    }
  },
};
