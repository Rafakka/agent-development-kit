import 'dotenv/config';
import fs, { Stats, writeFileSync } from 'fs';
import path from 'path';
import readline from 'readline';

const BASE_URL = 'https://www.moltbook.com/api/v1';
const API_KEY = process.env.MOLTBOOK_API_KEY;

if (!API_KEY) {
  throw new Error('Missing MOLTBOOK_API_KEY');
}

const proposalsDir = path.join(process.cwd(), 'proposals');

function ask(question:string): Promise<string> {
  const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout,
  });

  return new Promise(resolve =>
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    })
  )
}

async function chooseProposal():Promise< {proposal:any; file:string} > {
  const files = fs.readdirSync(proposalsDir).filter(f => f.endsWith('.json'));

  console.log('\nAvailable proposals:\n');
  files.forEach((f, i) => console.log(`${i + 1}. ${f}`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const index = await new Promise<number>(resolve => {
    rl.question('\nChoose proposal number:', answer => {
      rl.close();
      resolve(Number(answer) - 1);
    });
  });
  
  const file = files[index];
  const proposalPath = path.join(proposalsDir, file);
  const proposal = JSON.parse(fs.readFileSync(proposalPath, "utf-8"));

  return {proposal, file};

}

async function postProposal(proposal: any, proposalFile: string) {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(proposal)
  });

  const data = await res.json();
  console.log('\nPost response:\n', data);

  saveTracking(proposalFile, proposal, data);

}

function saveTracking(proposalFile:string, proposal:any, postResponse:any){
  const trackingDir = path.join(process.cwd(),'tracking');
  if (!fs.existsSync(trackingDir)) {
    fs.mkdirSync(trackingDir);
  }
  const record = {
    proposal_id: proposalFile.replace('.json',''),
    post_id:postResponse.id,
    url:`https://moltbook.com${postResponse.url}`,
    title:proposal.title,
    submolt:proposal.submolt,
    created_at:new Date().toISOString(),
    stats:{
      upvotes:postResponse.upvotes ?? 0,
      downvotes: postResponse.downvotes ?? 0,
      comments: 0
    },
    last_checked:null
  };

  const trackingFile = path.join(
    trackingDir,
    proposalFile.replace('json','track.json')
  );

  fs.writeFileSync(trackingFile, JSON.stringify(record, null, 2));
}

async function trackingProposals(targetPostId?:string) {
  const trackingDir = path.join(process.cwd(),'tracking');
  if (!fs.existsSync(trackingDir)){
    console.log('No tracking directory found');
    return;
  }

  const files = fs.readdirSync(trackingDir).filter(f => f.endsWith('.track.json'));

  for (const file of files) {
    const filePath = path.join(trackingDir, file);

    let record;
      try {
        record = JSON.parse(fs.readFileSync(filePath,'utf-8'));
      } catch {
        console.warn('skipping invalid file',file);
        continue;
      }

    if (targetPostId && record.post_id !== targetPostId) {
      continue;
    }

  const res = await fetch(`${BASE_URL})/posts/${record.post_id}`,{
    headers:{
      Authorization:`Bearer ${API_KEY}`
    }
  });

  if (!res.ok) {
    console.warn('Failed to fetch post', record.post_id);
    continue;
  }

  const post = await res.json();

  record.stats = {
    upvotes:post.upvotes ??record.stats.upvotes,
    downvotes: post.downvotes ?? record.stats.downvotes,
    comments: post.comments_count ?? post.comments ??
    record.stats.comments
  };

  record.last_checked = new Date().toISOString();

  fs.writeFileSync(filePath, JSON.stringify(record, null, 2));

  console.log(`Update tracking:${record.title}`);

  }
  
}

async function inspectPost(postId:string) {
  const res = await fetch(`${BASE_URL}/posts/${postId}`,{
    headers: {Authorization: `Bearer${API_KEY}`}
  });

  if (!res.ok) {
    console.error('post not found');
    return;
  }

  const post = await res.json();
  console.log({
    title:post.title,

  })
  
}

async function postComment(postId: string, content: string) {
  const res = await fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId,
      content
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to post comment: ${err}`);
  }

  const data = await res.json();
  console.log('Comment posted:', data.id);
}

async function chooseTrackedPost(): Promise<{
  post_id: string;
  title: string;
  file: string;
}> {
  const trackingDir = path.join(process.cwd(), 'tracking');

  if (!fs.existsSync(trackingDir)) {
    throw new Error('No tracking directory found.');
  }

  const files = fs
    .readdirSync(trackingDir)
    .filter(f => f.endsWith('.track.json'));

  if (files.length === 0) {
    throw new Error('No tracked posts found.');
  }

  console.log('\nTracked posts:\n');

  const records = files.map(file => {
    const filePath = path.join(trackingDir, file);

    try {
      const record = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return { ...record, file };
    } catch {
      return null;
    }
  }).filter(Boolean) as any[];

  records.forEach((r, i) => {
    console.log(
      `${i + 1}. ${r.title} ` +
      `(↑ ${r.stats.upvotes}, 💬 ${r.stats.comments})`
    );
  });

  const index = await ask('\nChoose a post to respond to: ');
  const selected = records[Number(index) - 1];

  if (!selected) {
    throw new Error('Invalid selection.');
  }

  return {
    post_id: selected.post_id,
    title: selected.title,
    file: selected.file
  };
}

async function menu() {
  console.log('\nSmall Gnosis = Agent Menu');
  console.log('\n1 - Post a proposal');
  console.log('\n2 - Track my proposals');
  console.log('\n3 - Post Comment');
  console.log('\n0 - Exit\n');

  const choice = await ask("choose an option.");

  switch(choice) {
    case '1': {
      const {proposal, file} = await chooseProposal();
      await postProposal(proposal, file);
      break;
    }
    case '2':{
      await trackingProposals();
      break;
    }
    case '3': {
      const tracked = await chooseTrackedPost();
      console.log(`\nResponding to: ${tracked.title}\n`);

      const content = await ask('Comment content:\n');
      
      const confirm = await ask('Post this comment? (y/n): ');

      if (!content.trim()) {
      console.log('Empty comment. Aborted.');
      break;
      }

      if (confirm.toLowerCase() !== 'y') {
        console.log('Cancelled.');
        break;
      }
      await postComment(tracked.post_id, content);
      break;
      
    }
    case '0':
      console.log('bye');
      process.exit(0);
    
    default:
      console.log('invalid option.');
  }
  
}

async function main() {
  const mode = process.argv[2];

  if (mode === 'post') {
    const {proposal, file} = await chooseProposal();
    await postProposal(proposal, file);
    return;
  }

  if (mode === 'track') {
    const postId = process.argv[3]; 
    await trackingProposals(postId);
    return;
  }

  await menu();

}

main().catch(console.error);