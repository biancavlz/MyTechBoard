// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const LearningMaterial = require("../models/LearningMaterial");

const bcryptSalt = 10;

mongoose
    .connect("mongodb://localhost/mytechboard", { useNewUrlParser: true })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    })
    .catch(err => {
        console.error("Error connecting to mongo", err);
    });

let users = [
    {
        username: "alice",
        password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
    },
    {
        username: "bob",
        password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    },
];

User.deleteMany()
    .then(() => {
        return User.create(users);
    })
    .then(usersCreated => {
        console.log(`${usersCreated.length} users created with the following id:`);
        console.log(usersCreated.map(u => u._id));
    })
    .then(() => {
        // Close properly the connection to Mongoose
        mongoose.disconnect();
    })
    .catch(err => {
        mongoose.disconnect();
        throw err;
    });

let learningMaterials = [
    {
        title: "Scaling Node.js Socket Server with Nginx and Redis",
        description: "a blog post about scaling Node.js Socket Server with Nginx and Redis",
        source: "https://blog.jscrambler.com/scaling-node-js-socket-server-with-nginx-and-redis/",
        materialType: "article",
        free: true,
    },
    {
        title: "JavaScript: The Good Parts",
        description: `This is a book about the JavaScript programming language. It is intended for programmers who, by
        happenstance or curiosity, are venturing into JavaScript for the first time. It is also intended for programmers
        who have been working with JavaScript at a novice level and are now ready for a more sophisticated
        relationship with the language. JavaScript is a surprisingly powerful language. Its unconventionality presents
        some challenges, but being a small language, it is easily mastered.`,
        source: "https://7chan.org/pr/src/OReilly_JavaScript_The_Good_Parts_May_2008.pdf",
        materialType: "book",
        free: true,
    },
    {
        title: "JavaScript: The Definite Guide",
        description: `Since 1996, JavaScript: The Definitive Guide has been the bible for JavaScript programmers―a programmer's guide and comprehensive reference to the core language and to the client-side JavaScript APIs defined by web browsers.`,
        source: "http://www.stilson.net/documentation/javascript.pdf",
        materialType: "book",
    },
    {
        title: "You Don't Know JS (book series)",
        description: `This is a series of books diving deep into the core mechanisms of the JavaScript language. The first edition of the series is now complete.`,
        source: "https://github.com/getify/You-Dont-Know-JS",
        materialType: "book",
    },
    {
        title: "You Don't Know JS (book series)",
        description: `This is a series of books diving deep into the core mechanisms of the JavaScript language. The first edition of the series is now complete.`,
        source: "https://github.com/getify/You-Dont-Know-JS",
        materialType: "book",
        free: false,
    },
    {
        title: "12 Books Every JavaScript Developer Should Read",
        description: `Blog post with 12 JS books Eric Elliott thinks you should read`,
        source:
            "https://medium.com/javascript-scene/12-books-every-javascript-developer-should-read-9da76157fb3",
        materialType: "book",
        free: true,
    },
    {
        title: "JavaScript Tutorials, Courses, and Books",
        description: `Find JavaScript tutorials submitted by developers with the best content rising to the top, voted on by the programmers that use them. Learn JavaScript online with the best JavaScript tutorials and courses.`,
        source: "https://gitconnected.com/learn/javascript",
        materialType: "tutorial",
        free: true,
    },
    {
        title: "JavaScript Courses on Coursera",
        description: `Coursera is a course platform with 100% online learning from the world’s best universities and companies`,
        source: "https://www.coursera.org/courses?query=javascript",
        materialType: "course",
        free: false,
    },
    {
        title: "16 Hand-Picked JavaScript Podcasts Still Running in 2018",
        description: `A list of JS podcasts`,
        source: "https://snipcart.com/blog/javascript-podcasts",
        materialType: "podcast",
        free: true,
    },

    //['course', 'tutorial', 'article', 'book', 'video', 'podcast', 'other']
];

LearningMaterial.deleteMany()
    .then(() => {
        return LearningMaterial.create(learningMaterials);
    })
    .then(learningMaterialsCreated => {
        console.log(
            `${learningMaterialsCreated.length} learning materials created with the following id:`
        );
        console.log(learningMaterialsCreated.map(lm => lm._id));
    })
    .then(() => {
        // Close properly the connection to Mongoose
        mongoose.disconnect();
    })
    .catch(err => {
        mongoose.disconnect();
        throw err;
    });
