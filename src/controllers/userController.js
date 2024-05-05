import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserSchema } from '../models/userModels.js';
import { validationResult } from 'express-validator';

const User = mongoose.model('User', UserSchema);

export const getUser = async (req, res) => {
    try {
        const user = await User.find({});
        res.json(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

export const loginRequired = (req, res, next) => {
    try {
        if (req.user) {
            next();
        } else {
            return res.status(401).json({ message: 'Unauthenticated User' });
        }
    } catch (err) {
        return res.status(500).send({ message: 'Internal server error' });
    }
};

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });


        }

        const saltRounds = 10;
        const newUser = new User(req.body);
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        newUser.hashPassword = hashedPassword;
        const savedUser = await newUser.save();
        return res.json(savedUser);
    } catch (err) {
        return res.status(400).send({
            message: err.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. No user found' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: user.email, username: user.username, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Return token in response
        return res.json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};