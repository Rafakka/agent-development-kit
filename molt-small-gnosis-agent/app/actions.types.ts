import {Proposal, TrackingRecord} from '../core/types';

export interface Actions {
    postProposal(proposal:Proposal) : Promise <any>;
    respondToPost(postId:string, content:string):
    Promise<any>;
    loadTracking(postId: string, title:string):
    Promise<TrackingRecord>;
    getPost(postId:string): Promise<any>;
}
