import OpenAI from "openai";
import dotenv from "dotenv";
import {writeFileSync, readFileSync} from 'fs'

dotenv.config();

const openai = new OpenAI();

export const createImg = async (title) => {
    const image = await openai.images.generate({
        model: "dall-e-3",
        prompt: `make a preview for the post with the title: ${title}`
    });

    const url = image.data[0].url;

    const imgResult = await fetch(url);
    const blob = await imgResult.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    const id = Date.now()

    writeFileSync(`./img/${id}.png`, buffer)

    return await uploadImage(`./img/${id}.png`)
}

const uploadImage = async (filePath) => {
    const mediaUrl = 'https://staging2.band-it.space/wp-json/wp/v2/media';
    const fileName = filePath.split('/').pop();
    const fileData = readFileSync(filePath);

    const response = await fetch(mediaUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': 'attachment; filename=' + fileName,
            'Authorization': `Bearer ${process.env.JWT_AUTH_SECRET_KEY}`
        },
        body: fileData
    });

    const data = await response.json();
    return data.id;
};
