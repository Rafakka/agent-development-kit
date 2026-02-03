const BASE_URL = 'https://www.moltbook.com/api/v1';

export function createMoltBookClient(apiKey:string) {
    const headers = {
        Autorization: `Beared ${apiKey}`,
        'Content-type': 'application\json',
    };

    return {
        async postProposal(proposal:any){
            const res = await fetch(`${BASE_URL}/posts`,{
                method:'POST',
                headers,
                body:JSON.stringify(proposal),
            });
            return res.json();
        },
        async postComment(postId:string, content:string) {
            const res = await fetch (`${BASE_URL}/comments,`,{
                method:'POST',
                headers,
                body: JSON.stringify({postId, content}),
            });
            return res.json();
        },
        async getPost(postId:string){
            const res = await fetch(`${BASE_URL}/posts/${postId}`,
                {headers});
                return res.json();
            },
        };
    }