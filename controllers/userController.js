const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const createToken = require('../utils/generateToken')

//register

const register = async (req, res, next) => {

    try {
        //input variable store
        const { name, email, password, profilePic, role } = req.body || {}


        //valid input
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fiels are mandatory" })
        }

        //check if user exists
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ error: "User already exists" })
        }

        //password hash
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //save to db
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'customer'
        });


        const savedUser = await newUser.save()

        //remove password from user to send back
        const userData = savedUser.toObject()
        delete userData.password

        res.status(201).json({ message: "User registered successfully", userData })

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })

    }
}

//login
const login = async (req, res, next) => {
    try {

        //input variable store
        const { email, password } = req.body || {}


        //valid input
        if (!email || !password) {
            return res.status(400).json({ error: "All fiels are mandatory" })
        }

        //check if user exists
        const userExists = await User.findOne({ email })
        if (!userExists) {
            return res.status(400).json({ error: "User not found" })
        }

        //compare password
        const passwordMatch = await bcrypt.compare(password, userExists.password)

        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid password" })
        }

        //token creation
        const token = createToken(userExists._id, 'customer');
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "PRODUCTION",
            sameSite: "Strict",
        });


        const userObject = userExists.toObject()
        delete userObject.password
        return res.status(200).json({
            message: "Login successful",
            user: userObject,
            token: token
        });


    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })

    }
}

//profile
const profile = async (req, res, next) => {
    try {
        const userId = req.user.id

        const userData = await User.findById(userId).select("-password")
        return res.status(200).json({ data: userData, message: "Profile retrieved" })

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })

    }
}

//update profile
const update = async (req, res) => {
  try {
    const userId = req.user._id;

    const { name, email, password } = req.body;

    const updates = { name, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select("-password");

    const token = createToken(updatedUser._id, updatedUser.role);

    res.status(200).json({
      message: "Profile updated",
      data: updatedUser,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



//logout
const logout = async (req, res, next) => {
    try {
        res.clearCookie("token")
        res.status(200).json({
            success: true,
            message: "Logout Successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })



    }
}


module.exports = { register, login, profile, logout, update }