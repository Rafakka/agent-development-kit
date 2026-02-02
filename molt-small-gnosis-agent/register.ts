

const BASE_URL = 'https://www.moltbook.com/api/v1';

async function register() {
    const res = await fetch(`${BASE_URL}/agents/register`,{
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            name:'small-gnosis',
            description:'Minimal Moltbook agent controlled by human'
        })
    });

    const data = await res.json();
    console.log(data);
}

register().catch(console.error);