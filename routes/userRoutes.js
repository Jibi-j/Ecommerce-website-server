const express = require('express')
const { register,login,profile,logout,update } = require('../controllers/userController')
const userRouter = express.Router()
const authUser = require('../middlewares/authUser')
const authAdmin = require('../middlewares/authAdmin')

//SIgnup
// /api/user
userRouter.post('/register',register)


//login
// /api/user/login
userRouter.post('/login',login)

//logout
userRouter.get('/logout',logout)

// /api/user/logout

//profile
userRouter.get('/profile',authUser,profile)

//profile update
userRouter.patch('/update',authUser,update)



module.exports = userRouter