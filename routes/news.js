const express = require("express");
const { scrapeMedium, scrapeHackerNews } = require("./tools/index");
const News = require("../models/News");
const puppeteer = require("puppeteer");

const router = express.Router();

router.get("/news", (req, res) => {
    Promise.all([scrapeMedium(), scrapeHackerNews()])
        .then(providers => {
            return Promise.all(
                providers.map(provider => {
                    return provider.map(news => {
                        return News.findOneAndUpdate(news, news, { upsert: true });
                    });
                })
            );
        })
        .then(() => {
            return Promise.all([News.find({})]);
        })
        .then(data => {
            res.render("news", { data: { articles: data[0], news: data[1] } });
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;
