import dotenv from "dotenv";

dotenv.config();

const getPosts = async () => {
    const response = await fetch('https://staging2.band-it.space/wp-json/wp/v2/posts');
    const posts = await response.json();
    console.log(posts);
    return posts;
};

const getToken = async () => {
        const response = await fetch('http://staging2.band-it.space/wp-json/jwt-auth/v1/token', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
            body: JSON.stringify({
                username: 'admin',
                password: '2ih2G8Tt5Y',
            })
        });
        const user = await response.json();
        console.log(user.token);
        return user.token;
};

export const createPost = async (title, content) => {
    const response = await fetch('http://staging2.band-it.space/wp-json/wp/v2/posts', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'accept': 'application/json',
            'Authorization': `Bearer ${process.env.JWT_AUTH_SECRET_KEY}`
        },
        body: JSON.stringify({
            title: `${title}`,
            content: `${content}`,
            status: "publish"
        })
    });

    const post = await response.json();
    console.log(post);
};
