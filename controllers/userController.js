const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jsonwt = require("jsonwebtoken");

const createToken = (_id) => {
    const jwt_key = process.env.JSONWEBTOKEN;
    return jsonwt.sign({ _id }, jwt_key, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        let user = await userModel.findOne({ email });

        if (user)
            return res.status(400).json("Email registered already.");

        if (!name || !email || !password)
            return res.status(400).json("Please enter all fields");

        if (!validator.isEmail(email))
            return res.status(400).json("Email invalid.");

        if (!validator.isStrongPassword(password))
            return res.status(400).json("Password is weak.");

        user = new userModel({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = createToken(user._id)
        res.status(200).json({ _id: user._id, name, email, token });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await userModel.findOne({ email }).select('+password');
        if (!user)
            return res.status(400).json("Invalid email or password.");

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword)
            return res.status(400).json("Invalid email or password.");

        const token = createToken(user._id)
        res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId)
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
const getUser = async (req, res) => {

    try {
        const all_users = await userModel.find()
        res.status(200).json(all_users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
module.exports = { registerUser, loginUser, findUser, getUser };