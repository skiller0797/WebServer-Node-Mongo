const {StatusCodes} = require('http-status-codes');
const Add = require('../model/add');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const { body } = require('express-validator');

const addLaundary = async(req,res) => {
    console.log('/addLaundary called')
    console.log(req.body);
    const { customername, phonenumber, weight, soap, machine, discount, email } = req.body;

    if (!customername || !phonenumber || !weight || !soap || !machine || !discount || !email) {
        return res.json({message:'invalidInfo'});
    }

    const addData = Add({
        customername,
        phonenumber,
        weight,
        soap,
        machine,
        discount,
        email
    });

    addData.save().then((data, err) => {
        if (err) {
            console.log(err);
            res.json({message: 'databaseError'});
            return;
        } else {
            res.json({message: 'insertedSuccess'});
            return;
        }
    })
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
  
  module.exports = { addLaundary };