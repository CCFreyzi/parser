import puppeteer from "puppeteer";
import { getPageTitle, getMeinInf, addNewPost, getPagesNumber, getPostFromPage } from "./parsers_function.js";
import { openaiChat } from "./gpts_requests.js";
import {getOwnPosts, ownPosts} from "./create_post.js";

const getAllPostUrl = async () => {
    const allPost = []

    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto(
        "https://cryptopotato.com/category/crypto-news/"
    );

    const numberPages = await getPagesNumber(page);
    await browser.close();

    for (let pageNum = 1; pageNum <= 1; pageNum++) {
        const browser = await puppeteer.launch({
            headless: false,
        });
        const page = await browser.newPage();

        await page.goto(
            `https://cryptopotato.com/category/crypto-news/page/${pageNum}/`
        );

        const allPostFromPage = await getPostFromPage(page);
        const pattern = /([^/]+)\/?$/;
        allPostFromPage.map((postUrl) => {
            allPost.push(postUrl.match(pattern)[1])
        })

        await browser.close();
    }
    return allPost

}

const newPosts = async ()  => {
    const allPostDonorSlug = await getAllPostUrl()

    const allOurPostSlug = await ownPosts();

    for (const url of allPostDonorSlug) {
        if (!allOurPostSlug.includes(url)) {
            await addNewPost(url)
            console.log(url);
        }
    }
}
// addNewPost('coinbase-mimics-microstrategy-announces-1-billion-convertible-bond-offering')
newPosts()

