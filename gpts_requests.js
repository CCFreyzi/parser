import dotenv from "dotenv";
import {OpenAI} from "openai";

dotenv.config();

export const openaiChat = async (title, mainInf, language) => {
    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: `I have an article: title: ${title},
                main content: ${mainInf}. Paraphrase this article, 
                and return it format object {"title": "", "content": ""}, return content in tags (html) and title without html and translations into ${language} language`,
            },
        ],
    };

    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify(requestBody),
            }
        );

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const sendMessage = async (title, content, language) => {

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })

    const postParaphraser = await openai.beta.assistants.retrieve("asst_Tju2VX9OkfhmrV5KKVzL0HsG");

    const thread = await openai.beta.threads.create()

    const message = await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `${title} ${content} ${language}`,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: postParaphraser.id,
    });

    do {
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        if (runStatus.status !== "completed") {
            console.log('1')
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
        }

        let messages = await openai.beta.threads.messages.list(thread.id);
        const assistantMessages = messages.data.filter((msg) => {
            return msg.role === "assistant";
        });

        return JSON.parse(assistantMessages[0].content[0].text.value)
    } while (true);
}
