const jwt = require('jsonwebtoken');
const Registration = require('../models/Registration');

module.exports = {
    approval (req, res) {
        jwt.verify(req.token, 'secret', async (error, authData) => {
            if (error) {
                return res.status(401).send();
            } else {
                const { registrationId } = req.params;
        
                try {
                    const registration = await Registration.findById(registrationId);

                    if (registration) {
                        registration.approved = true;
                        await registration.save();
                        
                        return res.json(registration);
                    }
            
                } catch (error) {
                    return res.status(400).json({
                        message: `Approval failed - ${error}`
                    });
                }
            }
        })
    }
};