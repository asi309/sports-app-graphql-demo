const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const User = require('../models/User');

module.exports = {
    createEvent (req, res) {
        jwt.verify(req.token, 'secret', async (error, authData) => {
            if (error) {
                res.status(401).send();
            } else {
                const { title, description, price, sport, date } = req.body;
                // const { filename } = req.file;
                const { location } = req.file;
                const { user } = authData;
                
                const existing_user = await User.findById(user._id);
        
                if (!existing_user) {
                    return res.status(400).json({
                        message: 'User does not exist'
                    });
                }
        
                // const event = await Event.create({
                //     title,
                //     description,
                //     price,
                //     thumbnail: filename,
                //     sport,
                //     date,
                //     user: user._id
                // })

                const event = await Event.create({
                    title,
                    description,
                    price,
                    thumbnail: location,
                    sport,
                    date,
                    user: user._id
                })
        
                await event
                        .populate('user', '-password')
                        .execPopulate();
        
                return res.json({
                    message: 'Event created successfully',
                    event
                });
            }
        })
    },

    deleteEvent (req, res) {
        jwt.verify(req.token, 'secret', async (error, authData) => {
            if (error) {
                res.status(401).send();
            } else {
                const { eventId } = req.params;
                try {
                    await Event.findByIdAndDelete(eventId);
                    return res.status(204).send();
                } catch (error) {
                    return res.status(400).json({
                        message: 'Event with id doesnot exist'
                    })
                }
            }
        })
    }
}