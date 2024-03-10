import puppeteer from "puppeteer-core";
import { getPageTitle, getMeinInf } from "./parsers_function.js";
import { openaiChat } from "./gpts_requests.js";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath:
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
    const page = await browser.newPage();
    await page.goto(
        "https://cryptopotato.com/shiba-inu-shib-explodes-65-daily-dogecoin-doge-follows-suit-with-20-surge-weekend-watch/"
    );

    const language = "UA";

    const title = await getPageTitle(page);
    const mainInf = await getMeinInf(page);

    const chatResponse = await openaiChat(title, mainInf, language);

    console.log(JSON.parse(chatResponse.choices[0].message.content));
    // console.log(JSON.parse(chatResponse.choices[0].message.title));
    // console.log(chatResponse);
    // console.log(title);
    // console.log(mainInf);

    await browser.close();
})();