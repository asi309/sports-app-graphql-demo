const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
    async createUser(request, response) {
        try {
            const { firstName, lastName, password, email } = request.body;

            const existing_user = await User.findOne({ email });

            if (!existing_user) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await User.create({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword
                });

                return jwt.sign({ user: {
                        _id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                } }, 'secret', (error, token) => response.json({
                    user: token,
                    user_id: user._id
                }));
                // return response.json({
                //     _id: user._id,
                //     email: user.email,
                //     firstName: user.firstName,
                //     lastName: user.lastName
                // });
            }

            return response.status(200).json({
                message: 'Email already in use'
            })

        } catch (error) {
            throw Error(`Error while registering new user: ${error}`);
        }
    },

    async getUserById(request, response) {
        const { userId } = request.params;

        try {
            const user = await User.findById(userId);

            return response.json(user);
        } catch (error) {
            
            return response.status(400).json({
                message: 'User id doesnot exist'
            });
        }
    }
}