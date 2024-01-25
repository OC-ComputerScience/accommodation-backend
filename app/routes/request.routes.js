
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
    
    //Retrieve all requests for student
    router.get("/studentReq/:studentId", [authenticate], requests.findAllForStudent);

    //Retrieve all requests for a particular status (most usually 'Open')
    router.get("/statusReq/:status", [authenticate], requests.findAllForStatus);

    //update a request with id
    router.put("/:id", [authenticate], requests.update);

    //delete a request with id
    router.delete("/:id", [authenticate], requests.delete);

    //delete all requests
    router.delete("/", [authenticate], requests.deleteAll);

    app.use("/accommodations-t4/requests", router);
};