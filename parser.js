import puppeteer from "puppeteer";
import { getPageTitle, getMeinInf } from "./parsers_function.js";
import { openaiChat } from "./gpts_requests.js";
import {createPost} from "./create_post.js";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto(
        "https://cryptopotato.com/bitcoin-explodes-to-71k-charts-new-all-time-high/"
    );

    const language = "ukrainian";

    const title = await getPageTitle(page);
    const mainInf = await getMeinInf(page);
    const chatResponse = await openaiChat(title, mainInf, language);

    await createPost(JSON.parse(chatResponse.choices[0].message.content).title, JSON.parse(chatResponse.choices[0].message.content).content);

    await browser.close();
})();
