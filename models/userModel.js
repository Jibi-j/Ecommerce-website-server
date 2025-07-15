const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type:String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at 8 characters long'],
        maxLength: [128, 'Password cannot exceed 128 characters']
    },
    role :{
        type:String,
        enum: ['customer','admin','seller'],
        default: 'customer'
    },
    profilePic:{
        type:String,
        default:null
    }
},{
    timestamps: true
    
})

module.exports = mongoose.model('User',userSchema)