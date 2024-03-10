import dotenv from "dotenv";
dotenv.config();

export const openaiChat = async (title, mainInf, language) => {
    console.log("API KEY: ", process.env.OPENAI_API_KEY);
    const requestBody = {
        // model: "gpt-4",
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: `I have an article: title: ${title},
                main content: ${mainInf}. Paraphrase this article and translations into ${language} language, 
                and return it in the same format json object {"title": "", "contents": [{}]}`,
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