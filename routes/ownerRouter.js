const express = require('express');
const router = express.Router();
// const Owner = require('../models/oweners-model');
const ownerModel = require('../models/oweners-model');

if (process.env.NODE_ENV === 'development') {
    router.post('/create', async (req, res) => {
        let owner = await ownerModel.find();
        if (owner.length > 0) {
            return res.status(503).send("You don't have permission to create a new Owner");
        }
        let createdOwner = await ownerModel.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        res.status(201).send(createdOwner);

    });
}

router.get('/', (req, res) => {
    res.send('Owner Route');

});


module.exports = router;