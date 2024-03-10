export const getPageTitle = async (page) => {
    return await page.evaluate(() => {
        return (
            "H1: " +
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