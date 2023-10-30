const {StatusCodes} = require('http-status-codes');
const User = require('../model/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const { body } = require('express-validator');

const signUp = async(req,res) => {
    console.log('/siginUp called')
    const { fullname, email, password } = req.body;
    console.log(req.body);
    if (!fullname || !email || !password) {
        return res.json({message:'invalidInfo'});
    }

    const hash_password = await bcrypt.hash(password, 10);

    const userData = {
        fullname,
        email,
        hash_password
    };

    const user = await User.findOne({email});

    if (user) {
        return res.json({
            message: 'alreadExist',
        });
    } else {
        User.create(userData).then((data, err) => {
            if (err) {
                res.json({message: 'databaseError'});
            } else {
                res.json({message: 'createdSuccess'});
            }
        })
    }
}

const signIn = async (req, res) => {
    console.log('/signin called');
    console.log(req.body)
    try {
        if (!req.body.email || !req.body.password) {
            res.send({
               message: 'invalidInfo',
            });
        } else {
   
            const user = await User.findOne({ email: req.body.email });
            
            if (user) {
                if (await user.authenticate(req.body.password)) {    
                    const token = jwt.sign(
                        { _id: user._id, role: user.role },
                        process.env.JWT_SECRET,{ expiresIn: "30d"});
                    const { _id, email, role, fullName } = user;
                    req.session.email = email;
                    const remember_me = req.body.remember_me;
                    const updatedUser = await User.findByIdAndUpdate(_id, { remember_me }, { new: true });
                    res.json({
                        message:'loginSuccess',
                        token,
                        user: { _id, email, role, fullName },
                        session: req.session.email
                    });
                } else {
                    res.json({
                    message: "passwordIncorrect",
                    });
                }
            } else {
                console.log(req.body);
                res.json({
                    message: "notRegistered",
                    });
            }
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error });
        console.log(error);
    }
  };

  const logOut = (req, res)=>{
    if(req.session.username) {
        req.session.destroy();
        res.send({msg:'sessionDestroyed'});
    } else {
        res.send({msg: 'session does not exist'});
    }
  }
  
  module.exports = { signUp, signIn, logOut };