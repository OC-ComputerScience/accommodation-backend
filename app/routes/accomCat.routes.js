module.exports = (app) => {
    const accomCat = require("../controllers/accomCat.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();

    //create a new accomCat
    router.post("/", [authenticate], accomCat.create);

    //get all accomCats
    router.get("/", [authenticate], accomCat.findAll);

    //get accomCat by id
    router.get("/:id", [authenticate], accomCat.findOne);

    //delete all accomCats 
    router.delete("/", [authenticate], accomCat.deleteAll);

    app.use("/accommodations-t4/accomcats", router);
}