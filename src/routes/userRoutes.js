import { addNewContact, getContacts, getContactWithID, updateContact, deleteContact } from '../controllers/crmController.js';
import { login, register, loginRequired, getUser } from '../controllers/userController.js';
import { check } from 'express-validator';

const routes = (app) => {
    app.route('/contact')
    // get all contacts
    .get((req,res, next) => {
        // middleware
        console.log(`Request from: ${req.originalUrl}`)
        console.log(`Request type: ${req.method}`)
        next();  
    }, loginRequired,getContacts)

    // post a new contact
    .post(loginRequired, [
        check('firstName').not().isEmpty().withMessage('First name is required'),
        check('lastName').not().isEmpty().withMessage('Last name is required'),
        check('email').isEmail().withMessage('Valid email is required')
    ], addNewContact);

    app.route('/contact/:contactId')
    // get specific contact
    .get(loginRequired, getContactWithID)

    .put(loginRequired, [
        check('firstName').not().isEmpty().withMessage('First name is required'),
        check('lastName').not().isEmpty().withMessage('Last name is required'),
        check('email').isEmail().withMessage('Valid email is required')
    ], updateContact)

    .delete(loginRequired, deleteContact)

    app.route('/auth/register')
        .post([
            check('username').not().isEmpty().withMessage('Username is required'),
            check('email').isEmail().withMessage('Valid email is required'),
            check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        ], register);
    
    app.route('/login')
        .post([
            check('email').isEmail().withMessage('Valid email is required'),
            check('password').not().isEmpty().withMessage('Password is required')
        ], login);
}

export default routes;