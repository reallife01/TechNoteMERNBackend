const User = require("../models/User");
const Note = require("../models/Note");

const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

// desc Get all users:
// routes Get /user:
// access private:

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").lean();
    if (!users?.length) {
        return res.status(400).json({ message: "NO USER FOUND" });
    }

    res.status(200).json(users);
});

// desc Create new users:
// routes Post /user:
// access private:

const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    // Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "All fields must be provided" });
    }
    // Check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: "Username already exists" });
    }
    // hash password
    const hashPwd = await bcrypt.hash(password, 10); //salt rounds
    const userObject = {
        username,
        password: hashPwd,
        roles,
    };
    // create a user
    const user = await User.create(userObject);
    if (user) {
        // create
        res
            .status(201)
            .json({ message: `New user ${username} created successfully` });
    } else {
        res.status(400).json({ message: "Invalid user data received" });
    }
});

// desc update a users:
// routes PATCH /user:
// access private:

const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, password, active } = req.body;

    // confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
        return res.status(400).json({ message: "All fields are required." });
    }
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found " });
    }

    // check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate username" });
    }
    user.username = username;
    user.roles = roles;
    user.active = active;
    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10); //salt rounds
    }
    const updateUser = await user.save();
    res.status(200).json({ message: `${updateUser.username} updated` });
});

// desc delete a users:
// routes DELETE /user:
// access private:

const deleteUser = asyncHandler(async (req, res) => {
    // desc delete users
    // routes DELETE user
    // access private

    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: "user ID is required" });
    }

    //   Does the user still have assigned notes
    const notes = await Note.findOne({ user: id }).lean().exec();
    if (notes) {
        return res.status(400).json({ message: "user assigned notes" });
    }

    //   Does the user exist to delete 
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "user not found " });
    }

    const result = await user.deleteOne();
    const reply = `username ${result.username} with ID ${result._id}
  delete`;

    res.json(reply);
});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
};