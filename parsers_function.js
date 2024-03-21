import puppeteer from "puppeteer";
import {sendMessage} from './gpts_requests.js'
import {openaiChat} from './gpts_requests.js'
import {createPost} from './create_post.js'
import {createImg} from "./generate_img.js";

export const getPageTitle = async (page) => {
    return await page.evaluate(() => {
        return (
            document
                .querySelector(".page-title h1")
                .innerHTML.replace(/^\s+|\s+$/g, "")
        );
    });
};

export const getMeinInf = async (page) => {
    const meinInf = await page.evaluate(() => {
        const parentDiv = document.querySelector(".coincodex-content").children;

        const postContent = [];

        for (let i = 0; i < parentDiv.length; i++) {
            const child = parentDiv[i];
            if (child.tagName === "P" || child.tagName === "H2") {
                postContent.push(`${child.tagName}: ${child.textContent}`);
            } else if (child.tagName === "FIGURE") {
                postContent.push(
                    `${child.children[0].children[0].tagName}: ${child.children[0].children[0].src}`
                );
            }
        }

        return postContent.join("\n");
    });

    return meinInf;
};

export const getPagesNumber = async (page) => {
    return await page.evaluate(() => {
        const list = document.querySelector('.pagination').querySelectorAll('li');
        return list.length;
    });
}

export const getPostFromPage = async (page) => {
    return await page.evaluate(() => {
        const allPost = Array.from(document.querySelectorAll('.image-link')).map(post => post.href);
        return allPost;
    });
}

export const getAllPostUrl = async () => {
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

    for (let pageNum = 1; pageNum <= 2; pageNum++) {
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


export const addNewPost = async (postDonorSlug) => {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(
        `https://cryptopotato.com/${postDonorSlug}/`
    );

    const language = "ukrainian";

    const title = await getPageTitle(page);
    const content = await getMeinInf(page);

    const imgId = await createImg(title)

    let answer;
    try {
        answer = await sendMessage(title, content, language);
    } catch (error) {
        console.error("Помилка під час відправки повідомлення:", error);
        await browser.close();
        return;
    }

    await createPost(answer.title, answer.content, postDonorSlug, imgId);

    await browser.close();
};



