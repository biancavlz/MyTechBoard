const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
});

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
