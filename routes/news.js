const express   = require('express')
const puppeteer = require('puppeteer')

const router = express.Router();

const scrapeMedium = async () => {
  const browser = await puppeteer.launch()
  const page    = await browser.newPage()

  await page.goto('https://medium.com/tag/javascript')

  const scrapedData = await page.evaluate(() =>
    Array.from(document.querySelectorAll('div.postArticle'))
      .map(link => ({
        title: link.querySelector('.graf--title').textContent,
        link: link.querySelector('div.postArticle-readMore a:first-child').getAttribute("href")
      })
    )
  )

  await browser.close()
  return scrapedData
}

const scrapeHackerNews = async () => {
  const browser = await puppeteer.launch()
  const page    = await browser.newPage()
  const query   = '?query=JavaScript&sort=byPopularity&dateRange=pastWeek&type=all&storyText=false&prefix=false&page=0'

  await page.goto(
    'https://hn.algolia.com/' + query
  )

  const scrapedData = await page.evaluate(() =>
    Array.from(document.querySelectorAll('div.item-title-and-infos'))
      .map(link => ({
        title: link.querySelector('h2').textContent,
        link: link.querySelector('a').getAttribute('href')
      })
    )
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

module.exports = router;
