import { Proposal } from "../core/types";
import { respondToPost } from "./respondToPost";

export function createActions (client:any) {
    return {
        async postProposal(proposal:Proposal) {
            return client.postProposal(proposal);
        },

        async respondToPost(postId:string, content:string) {
            return client.postComment(postId, content);
        },

        async getPost(postId:string) {
            return client.getPost(postId);
        },
    };
}