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

    addData.save().then(async (data, err) => {
        if (err) {
            console.log(err);
            res.json({message: 'databaseError'});
            return;
        } else {
            const count = await Add.find({phonenumber}).count();
            res.json({message: 'insertedSuccess', count:count});
            return;
        }
    })
}

const getSalesData = async(req,res) => {
    console.log('/getSalesData called')

    let today_count = 0;
    let today_loads = 0;
    let week_count = 0;
    let week_loads = 0;
    let month_count = 0;
    let month_loads = 0;
    let year_count = 0;
    let year_loads = 0;

    let today_count_last = 0;
    let today_loads_last = 0;
    let week_count_last = 0;
    let week_loads_last = 0;
    let month_count_last = 0;
    let month_loads_last = 0;
    let year_count_last = 0;
    let year_loads_last = 0;

    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);
    
    const query = {
      createdAt: {
        $gte: currentDate,
        $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      }
    };    
    await Add.find(query).then( (data, err) => {
        if (err) {
            console.log(err);
            res.json({message: 'databaseError'});
            return;
        } else {
            today_count = data.length;
            today_loads = data.map(doc => parseInt(doc.weight)).reduce((acc, curr) => acc + curr, 0);
            // const sum = data.map(doc => parseInt(doc.weight)).reduce((acc, curr) => acc + curr, 0);
            return;
        }
    })

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const query1 = {
      createdAt: {
        $gte: startOfMonth,
        $lt: new Date(endOfMonth.getTime() + 24 * 60 * 60 * 1000)
      }
    };
    await Add.find(query1).then( (data, err) => {
        if (err) {
            console.log(err);
            res.json({message: 'databaseError'});
            return;
        } else {
            month_count = data.length;
            month_loads = data.map(doc => parseInt(doc.weight)).reduce((acc, curr) => acc + curr, 0);
            // const sum = data.map(doc => parseInt(doc.weight)).reduce((acc, curr) => acc + curr, 0);
            return;
        }
    })

    const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));
    const query2 = {
      createdAt: {
        $gte: firstDayOfWeek,
        $lt: lastDayOfWeek
      }
    };
    await Add.find(query2).then( (data, err) => {
        if (err) {
            console.log(err);
            res.json({message: 'databaseError'});
            return;
        } else {
            week_count = data.length;
            week_loads = data.map(doc => parseInt(doc.weight)).reduce((acc, curr) => acc + curr, 0);
            // const sum = data.map(doc => parseInt(doc.weight)).reduce((acc, curr) => acc + curr, 0);
            return;
        }
    })

    const currentDate2 = new Date();
    currentDate2.setUTCHours(0, 0, 0, 0);

    const startOfYear = new Date(currentDate2.getFullYear(), 0, 1);
    const endOfYear = new Date(currentDate2.getFullYear(), 11, 31);
    const query3 = {
      createdAt: {
        $gte: startOfYear,
        $lte: endOfYear
      }
    };
    await Add.find(query3).then( (data, err) => {
        if (err) {
            console.log(err);
            res.json({message: 'databaseError'});
            return;
        } else {
            year_count = data.length;
            year_loads = data.map(doc => parseInt(doc.weight)).reduce((acc, curr) => acc + curr, 0);
            // const sum = data.map(doc => parseInt(doc.weight)).reduce((acc, curr) => acc + curr, 0);            return;
        }
    })

//7 days ago data
    const currentDate1 = new Date();
    currentDate1.setUTCHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(currentDate1.getTime() - (7 * 24 * 60 * 60 * 1000));
    const query4 = {
      createdAt: {
        $gte: sevenDaysAgo,
        $lt: new Date(sevenDaysAgo.getTime() + 24 * 60 * 60 * 1000)
      }
    };
    await Add.find(query4).then( (data, err) => {
        if (err) {
            console.log(err);
            res.json({message: 'databaseError'});
            return;
        } else {
            today_count_last = data.length;
            today_loads_last = data.map(doc => parseInt(doc.weight)).reduce((acc, curr) => acc + curr, 0);
            // const sum = data.map(doc => parseInt(doc.weight)).reduce((acc, curr) => acc + curr, 0);            return;
        }
    })

    console.log(today_loads)
    res.send({todayCount:today_count, todayLoads: today_loads, weekCount: week_count,weekLoads: week_loads, monthCount: month_count, monthLoads: month_loads});
}
  
module.exports = { addLaundary, getSalesData };