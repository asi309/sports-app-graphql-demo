const jwt = require('jsonwebtoken');
const Registration = require('../models/Registration');


module.exports = {
    create (req, res) {
        jwt.verify(req.token, 'secret', async (error, authData) => {
            if (error) {
                res.status(401).send();
            } else {
                const { user } = authData;
                const { eventId } = req.params;
        
                const registration = await Registration.create ({
                    user: user._id,
                    event: eventId
                })
        
                await registration
                    .populate('user', '-password')
                    .populate('event')
                    .execPopulate();

                registration.owner = registration.event.user;
                registration.eventTitle = registration.event.title;
                registration.eventPrice = registration.event.price;
                registration.eventDate = registration.event.date;
                registration.userEmail = registration.user.email;
                registration.save();
                    
                const ownerSocket = req.connectedUsers[registration.event.user];

                if (ownerSocket) {
                    req.io.to(ownerSocket).emit('registration_req', registration);
                }
        
                return res.json(registration);
            }
        })
    },

    async getRegistration (req, res) {
        const { registrationId } = req.params;
        try {
            const registration = await Registration.findById(registrationId);
            await registration
                .populate('user', '-password')
                .populate('event')
                .execPopulate();
                
            res.json(registration);
        } catch (error) {

            res.status(400).json({
                message: 'Registration not found'
            })
        }
    },

    getRegistrationsByUser (req, res) {
        jwt.verify(req.token, 'secret', async (error, authData) => {
            if (error) {
                return res.status(401).send();
            } else {

                try {
                    const registrationArray = await Registration.find({ 'owner': authData.user._id })

                    if (registrationArray) {
                        return res.json(registrationArray);
                    }
                } catch (error) {
                    return res.status(400).json({
                        message: 'Registrations not found'
                    })
                }
            }
        })
    }
}