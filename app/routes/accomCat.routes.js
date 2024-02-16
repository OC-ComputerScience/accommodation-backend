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
    router.delete('/:accomCatId', [authenticate], accomCat.deleteById);

    //update accomCat by id
    router.put('/:accomCatId', [authenticate], accomCat.update);

    app.use("/accommodations-t4/accomCats", router);
}

