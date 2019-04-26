const express = require("express");
const router = express.Router();
const LearningMaterial = require("../models/LearningMaterial");
const Video = require("../models/Video");
const { scrapeYoutube } = require("./tools/index");
const { authenticationCheck } = require("./tools/index");

router.get("/learning", (req, res, next) => {
    scrapeYoutube()
        .then(youtubeVideos => {
            return Promise.all(
                youtubeVideos.map(element => {
                    element.title = element.title.trim();
                    return Video.findOneAndUpdate(element, element, { upsert: true, new: true });
                })
            );
        })
        .then(() => {
            return Promise.all([LearningMaterial.find({}), Video.find()]);
        })
        .then(data => {
            res.render("learning/index", { learningMaterials: data[0], youtubeVideos: data[1] });
        })
        .catch(err => {
            console.log("Error rendering LearningMaterials and Youtube videos", err);
        });
});

router.get("/learning/new", authenticationCheck, (req, res, next) => {
    res.render("learning/new");
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
