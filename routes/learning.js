const express = require("express");
const router = express.Router();
const LearningMaterial = require("../models/LearningMaterial");

router.get("/learning", (req, res, next) => {
    LearningMaterial.find({})
        .then(learningMaterials => {
            res.render("learning", { learningMaterials });
        })
        .catch(err => {
            console.log("Error rendering LearningMaterials", err);
        });
});

module.exports = router;
