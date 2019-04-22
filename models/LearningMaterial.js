const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const learningMaterialSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    source: {
        type: String,
        required: true,
    },
    materialType: {
        type: String,
        enum: ["course", "tutorial", "article", "book", "video", "podcast", "other"],
        required: true,
    },
    free: {
        type: Boolean,
        default: true,
    },
});

const LearningMaterial = mongoose.model("LearningMaterial", learningMaterialSchema);
module.exports = LearningMaterial;
