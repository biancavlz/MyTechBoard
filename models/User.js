const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const techboardSchema = new Schema({
    learningMaterials: Array,
    news: Array,
    videos: Array,
    events: Array,
});

const userSchema = new Schema(
    {
        username: String,
        password: String,
        techboard: techboardSchema,
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        role: {
            type: String,
            enum: ["User", "Admin"],
            default: "User",
        },
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
