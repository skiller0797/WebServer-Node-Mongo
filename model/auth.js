const mongoose = require('mongoose');
const bcyrpt = require('bcrypt');

const userSchema = new mongoose.Schema({

    fullname: {
        type: String,
        require: true,
        trim: false,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    hash_password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum:['user', 'admin'],
        default: 'user'
    },
    contactNumber: {
        type: String
    },
    profilePicture: {
        type: String
    },
    remember_me: {
        type: String,
        default:'false'
    },
},{timestamps: true});

//for get fullname from when we get data from database
userSchema.virtual('fullName').get(function(){
    return `${this.firstName}${this.lastName}`;
})

userSchema.method({
    async authenticate(password){
        
        const res = await bcyrpt.compare(password, this.hash_password);
        console.log(res);
        return res;
    }
});

module.exports = mongoose.model('User', userSchema);