import dotenv from "dotenv";

dotenv.config();

export const getOwnPosts = async () => {
    const response = await fetch('https://staging2.band-it.space/wp-json/wp/v2/posts?_embed&meta_keys=custom_keeeeey');
    const posts = await response.json();
    const pattern = /([^/]+)\/?$/;
    const postsUrl = []
    posts.map((post) => {
        postsUrl.push(post.link.match(pattern)[1])
    })
    return postsUrl;
};

export const ownPosts = async () => {
    return await getOwnPosts();
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
                password: '$Osj!^wqqdChVktpVa&kcae^',
            })
        });
        const user = await response.json();
        return user.token;
};

export const createPost = async (title, content, postDonorSlug, imgId) => {
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
            featured_media: `${imgId}`,
            status: "publish",
            slug: `${postDonorSlug}`,
        })
    });

    const post = await response.json();
};
