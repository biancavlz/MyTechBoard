const express = require("express");
const router = express.Router();
const LearningMaterial = require("../models/LearningMaterial");

router.get("/learning", (req, res, next) => {
    LearningMaterial.find({})
        .then(learningMaterials => {
            res.render("learning/index", { learningMaterials });
        })
        .catch(err => {
            console.log("Error rendering LearningMaterials", err);
        });
});

router.get("/learning/new", (req, res, next) => {
    res.render("learning/new");
});

router.post("/learning", (req, res, next) => {
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
