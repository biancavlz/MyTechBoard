const puppeteer = require("puppeteer");
const $ = require("cheerio");
const url =
    "https://hn.algolia.com/?query=JavaScript&sort=byDate&dateRange=all&type=story&storyText=false&prefix&page=0";

/* using cheeerio for parsing and puppeteer for rendering page
tutorial: https://medium.freecodecamp.org/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3
*/

puppeteer
    .launch()
    .then(function(browser) {
        return browser.newPage();
    })
    .then(function(page) {
        return page.goto(url).then(function() {
            return page.content();
        });
    })
    .then(function(html) {
        $(".item-title-and-infos > h2 > a", html).each((index, element) => {
            console.log($(element).text());
        });
    })
    .catch(function(err) {});
