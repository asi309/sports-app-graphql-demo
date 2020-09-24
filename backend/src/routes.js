const express = require('express');
const multer = require('multer');

const ApprovalController = require('./controllers/ApprovalController');
const DashboardController = require('./controllers/DashboardController');
const EventController = require('./controllers/EventController');
const LoginController = require('./controllers/LoginController');
const RegistrationController = require('./controllers/RegistrationController');
const RejectionController = require('./controllers/RejectionController');
const UserController = require('./controllers/UserController');
// const uploadConfig = require('./config/upload');
const s3Upload = require('./config/s3Uploads');
const verifyToken = require('./config/verifyToken');

const routes = express.Router();
// const upload = multer(uploadConfig);


routes.get('/', (request, response) => {
    response.send('hello from express');
});

//Dashboard
routes.get('/dashboard/:sport', verifyToken, DashboardController.getAllEvents);
routes.get('/dashboard', verifyToken, DashboardController.getAllEvents);
routes.get('/user/events', verifyToken, DashboardController.getEventsByUser);
routes.get('/event/:eventId', verifyToken, DashboardController.getEventById);

//Events
routes.post('/event', verifyToken, s3Upload.single("thumbnail"), EventController.createEvent);
routes.delete('/event/:eventId', verifyToken, EventController.deleteEvent);

//Login
routes.post('/login', LoginController.store);

//Registration
routes.post('/registration/:eventId', verifyToken, RegistrationController.create);
routes.get('/registration/:registrationId', RegistrationController.getRegistration);
routes.get('/registrations', verifyToken, RegistrationController.getRegistrationsByUser);

//Approvals
routes.post('/registration/:registrationId/approval', verifyToken, ApprovalController.approval);
//Rejections
routes.post('/registration/:registrationId/rejection', verifyToken, RejectionController.rejection);

//Users
routes.post('/user/register', UserController.createUser);
routes.get('/user/:userId', UserController.getUserById);

module.exports = routes;