const fetch = require('node-fetch');

const openaiChat = async (title, mainInf, language) => {
    const OPENAI_API_KEY = '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';

    const requestBody = {
        model: "gpt-4",
        messages: [
            {
                role: "user",
                content: `I have an article: title: ${title}, main content: ${mainInf}. Paraphrase this article and translations into ${language} language, and return it in the same format`
            }
        ]
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        return await response.json();

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

module.exports = openaiChat;
