const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { authenticationCheck } = require("./tools/index");
const LearningMaterial = require("../models/LearningMaterial");
const mongoose = require("mongoose");

router.get("/techboard", authenticationCheck, (req, res, next) => {
    if (!req.user.techboard) return res.render("techboard", { materials: [] });
    const learningMaterialIds = req.user.techboard.learningMaterials;
    const objectIds = learningMaterialIds.map(id => {
        return mongoose.Types.ObjectId(id);
    });
    const query = LearningMaterial.where("_id").in(objectIds);
    query
        .then(materials => {
            console.log(materials);
            res.render("techboard", { materials });
        })
        .catch(err => {
            console.error("Error displaying techboard materials", err);
        });
});

router.post("/techboard", authenticationCheck, (req, res, next) => {
    console.log(req.body);
    console.log(req.user);
    const user = req.user;
    if (typeof user.techboard === "undefined") {
        const techboard = {
            learningMaterials: [],
            news: [],
            videos: [],
            events: [],
        };
        user.techboard = techboard;
    }
    user.techboard.learningMaterials.push(req.body.resourceId);
    user.save()
        .then(() => {
            res.redirect("/techboard");
        })
        .catch(err => {
            console.error("Failed to save techboard", err);
        });
});

router.post("/learning", authenticationCheck, (req, res, next) => {
    const { title, description, source, materialType, free } = req.body;
    LearningMaterial.create({
        title,
        description,
        source,
        materialType,
        free,
    })
        .then(() => {
            res.redirect("/learning");
        })
        .catch(err => {
            console.error("Error while adding learning material", err);
        });
});

module.exports = router;
