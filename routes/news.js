const express = require('express')
const puppeteer = require('puppeteer')
// const scraper = require('./news')

const router = express.Router();

const scrapeMedium = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://medium.com/search?q=headless%20browser')

  const scrapedData = await page.evaluate(() =>
      Array.from(document.querySelectorAll('div.postArticle-content a:first-child[data-action-value]'))
          .filter(node => node.querySelector('.graf--title'))
          .map(link => ({
              title: link.querySelector('.graf--title').textContent,
              link: link.getAttribute('data-action-value')
          }))
  )

  await browser.close()
  return scrapedData
}

router.get('/news', (req, res) => {
  const mediumArticles = new Promise((resolve, reject) => {
    scrapeMedium()
      .then(data => {
        resolve(data)
      })
      .catch(err => reject('Medium scrape failed'))
  })

  Promise.all([mediumArticles])
    .then(data => {
      res.render('news', { data: { articles: data[0] } })
    })
    .catch(err => res.status(500).send(err))
})

module.exports = router;
