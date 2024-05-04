import { addNewContact, getContacts, getContactWithID, updateContact, deleteContact } from '../controllers/crmController.js';

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Retrieve a list of contacts
 *     description: Retrieve a list of all contacts in the CRM system.
 *     responses:
 *       200:
 *         description: A list of contacts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 */

const routes = (app) => {
    app.route('/contact')
    // get all contacts
    .get((req,res, next) => {
        // middleware
        console.log(`Request from: ${req.originalUrl}`)
        console.log(`Request type: ${req.method}`)
        next();  
    }, getContacts)

    // post a new contact
    .post(addNewContact);

    app.route('/contact/:contactId')
    // get specific contact
    .get(getContactWithID)

    .put(updateContact)

    .delete(deleteContact)
}

export default routes;