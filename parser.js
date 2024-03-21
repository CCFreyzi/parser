import {addNewPost, getAllPostUrl} from "./parsers_function.js";
import {ownPosts} from "./create_post.js";

const newPosts = async () => {
    const allPostDonorSlug = await getAllPostUrl()

    const allOurPostSlug = await ownPosts();

    for (const url of allPostDonorSlug) {
        if (!allOurPostSlug.includes(url)) {
            await addNewPost(url)
            break
        }
    }
}
newPosts()
