const jwt = require('jsonwebtoken');
const Event = require('../models/Event');

module.exports = {
  getEventById(req, res) {
    jwt.verify(req.token, 'secret', async (error, authData) => {
      if (error) {
        res.status(401).send();
      } else {
        const { eventId } = req.params;
        try {
          const event = await Event.findById(eventId);
          if (event) {
            return res.json({ authData, event });
          }
        } catch (error) {
          return res.status(400).json({
            message: 'Event with id doesnot exist',
          });
        }
      }
    });
  },

  getAllEvents(req, res) {
    jwt.verify(req.token, 'secret', async (error, authData) => {
      if (error) {
        res.status(401).send();
      } else {
        const { sport } = req.params;
        let query = {};
        if (sport) {
          query = { sport };
        }
        try {
          const events = await Event.find(query);

          if (events) {
            return res.json({ authData, events });
          }
        } catch (error) {
          return res.status(400).json({
            message: 'There are no events yet',
          });
        }
      }
    });
  },

  getEventsByUser(req, res) {
    jwt.verify(req.token, 'secret', async (error, authData) => {
      if (error) {
        return res.status(401).send();
      } else {
        // const { user } = req.headers;
        const { user } = authData;
        try {
          const events = await Event.find({ user: user._id });

          if (events) {
            return res.json({ authData, events });
          }
        } catch (error) {
          return res.status(400).json({
            message: 'There are no events yet',
          });
        }
      }
    });
  },
};
