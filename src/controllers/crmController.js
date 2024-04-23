import mongoose from 'mongoose';
import { ContactSchema } from '../models/crmModel.js';

const Contact = mongoose.model('Contact', ContactSchema);

export const addNewContact = async (req, res) => {
    let newContact = new Contact(req.body);

    try {
        const contact = await newContact.save();
        res.status(201).json(contact);
    } catch (err) {
        res.status(400).send(err);
    }
};

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.json(contacts);
    } catch (err) {
        res.status(400).send(err);
    }
};


export const getContactWithID = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.contactId);
        if (!contact) {
            return res.status(404).send({ message: 'Contact not found' });
        }
        res.json(contact);
    } catch (err) {
        res.status(400).send(err);
    }
};


export const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findOneAndUpdate({ _id: req.params.contactId } , req.body, { new: true});
        if (!contact) {
            return res.status(404).send({ message: 'Contact not found' });
        }
        res.json(contact);
    } catch (err) {
        res.status(400).send(err);
    }
};

export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findOneAndDelete(req.params.contactId);
        if (!contact) {
            return res.status(404).send({ message: 'Contact not found' });
        }
        res.json(contact);
    } catch (err) {
        res.status(400).send(err);
    }
};
