const puppeteer = require("puppeteer");

const scrapeMedium = async () => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto("https://medium.com/tag/javascript");

    const scrapedData = await page.evaluate(() =>
        Array.from(document.querySelectorAll("div.postArticle")).map(link => ({
            title: link.querySelector(".graf--title").textContent,
            link: link.querySelector("div.postArticle-readMore a:first-child").getAttribute("href"),
        }))
    );

    await browser.close();
    return scrapedData;
};

const scrapeHackerNews = async () => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const query =
        "?query=JavaScript&sort=byPopularity&dateRange=pastWeek&type=all&storyText=false&prefix=false&page=0";

    await page.goto("https://hn.algolia.com/" + query);

    const scrapedData = await page.evaluate(() =>
        Array.from(document.querySelectorAll("div.item-title-and-infos")).map(link => ({
            title: link.querySelector("h2").textContent,
            link: link.querySelector("a").getAttribute("href"),
        }))
    );

    await browser.close();
    return scrapedData;
};

const scrapeYoutube = async () => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const url = "https://www.youtube.com/results?search_query=javascript+tutorial";

    await page.goto(url);

    const scrapedData = await page.evaluate(() =>
        Array.from(document.querySelectorAll("#video-title")).map(link => ({
            title: link.textContent,
            link: link.getAttribute("href"),
        }))
    );

    await browser.close();
    return scrapedData;
};

const authenticationCheck = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.render("error", {
            errorMessage: `This is a content is available only for logged in users, please <a href="/auth/signup">sign up</a>
                or <a href="/auth/login">log in</a>.`,
        });
    }
};

const rolesCheck = role => {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            res.render("error", { errorMessage: "This is a protected route" });
        } else if (req.user.role !== role) {
            res.render("error", {
                errorMessage: "You do not have sufficient privileges",
            });
        } else {
            next();
        }
    };
};

module.exports = {
    scrapeHackerNews,
    scrapeMedium,
    scrapeYoutube,
    authenticationCheck,
    rolesCheck,
};
