const puppeteer = require('puppeteer');
const parsers_function = require('./parsers_function');
const gpts_requests = require('./gpts_requests');

(async () => {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto('https://cryptopotato.com/shiba-inu-shib-explodes-65-daily-dogecoin-doge-follows-suit-with-20-surge-weekend-watch/')

    const language = 'UA'

    const title = await parsers_function.getPageTitle(page);

    const mainInf = await parsers_function.getMeinInf(page);

    const chatResponse = await gpts_requests(title, mainInf, language);

    console.log(chatResponse.choices[0].message.content);
    console.log(title);
    console.log(mainInf);

    await browser.close();
})()
