import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import dotenv from 'dotenv';


dotenv.config()

export const addUser = async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            firstName,
            lastName,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "User added successfully", token, user: { email, firstName, lastName } });

    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Passwords match, generate a new JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET, { expiresIn: "1h" });

        // Respond with the token and user data (without the password)
        res.status(200).json({ message: "Login successful", token, user: { email: user.email, firstName: user.firstName, lastName: user.lastName, profilepic: user.profilepic } });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export async function getAllUsers(req, res) {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
}
