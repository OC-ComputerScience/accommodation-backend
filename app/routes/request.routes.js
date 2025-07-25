
module.exports = (app) => {
    const requests = require ("../controllers/request.controller.js");
    const {authenticate} = require("../authorization/authorization.js");
    var router = require("express").Router();

    //create a new request
    router.post("/", [authenticate], requests.create);

    //retrieve one request with id
    router.get("/requestId/:requestId",  requests.findOne)

    //retrieve all requests
    router.get("/", [authenticate], requests.findAll);

    // retrieve latest manually approved request
    router.get("/latestApproved/:studentId", [authenticate], requests.findLatestApproved);
    
    //Retrieve all requests for student
    router.get("/studentReq/:studentId", [authenticate], requests.findAllForStudent);

    //Retrieve all requests for a particular status (most usually 'Open')
    router.get("/statusReq/:status", [authenticate], requests.findAllForStatus);

    //update a request with id
    router.put("/:id", [authenticate], requests.update);

    //delete a request with id
    router.delete("/:id", [authenticate], requests.delete);

    app.use("/accommodations-t4/requests", router);
};

// const express = require('express');
// const sendAccommodationEmail = require('../utils/nodeMailer.helper');

// const router = express.Router();

// router.post('/request', async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ message: 'Email is required' });
//     }
//     const result = await sendAccommodationEmail(req.body) || { success: false, message: "Email function failed" };
//     res.status(result.success ? 200 : 500).json({ message: result.message });
    
//     // const result = await sendAccommodationEmail(email);
//     // res.status(result.success ? 200 : 500).json({ message: result.message });
// });

// module.exports = router;