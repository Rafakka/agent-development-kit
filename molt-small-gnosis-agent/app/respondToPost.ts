import { createMoltBookClient } from "../core/moltbookClient";

export async function respondToPost(
    apiKey:string,
    postId:string,
    content:string,
) {
    const client = createMoltBookClient(apiKey);
    return client.postComment(postId, content);
}