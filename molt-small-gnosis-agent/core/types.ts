
export type Proposal = {
    title:string;
    submolt:string;
    content:string;
};

export type TrackingRecord = {
    post_id:string;
    title:string;
    stats : {
        upvotes:number;
        donwvotes:number;
        comments:number;
    };
    last_checked:string | null;
};