const express = require('express')
const { scrapeMedium, scrapeHackerNews } = require('./tools/index')
const puppeteer = require('puppeteer')

const router = express.Router()

router.get('/news', (req, res) => {
    const mediumArticles = new Promise((resolve, reject) => {
        scrapeMedium()
            .then(data => {
                resolve(data)
            })
            .catch(err => reject('Medium scrape failed'))
    })

    const hackerNews = new Promise((resolve, reject) => {
        scrapeHackerNews()
            .then(data => {
                resolve(data)
            })
            .catch(err => reject('Hacker News scrape failed'))
    })

    Promise.all([mediumArticles, hackerNews])
        .then(data => {
            res.render('news', { data: { articles: data[0], news: data[1] } })
        })
        .catch(err => res.status(500).send(err))
})

module.exports = router
