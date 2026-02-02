import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const BASE_URL = 'https://www.moltbook.com/api/v1';
const API_KEY = process.env.MOLTBOOK_API_KEY;

if (!API_KEY) {
  throw new Error('Missing MOLTBOOK_API_KEY');
}

const proposalsDir = path.join(process.cwd(), 'proposals');

async function chooseProposal() {
  const files = fs.readdirSync(proposalsDir).filter(f => f.endsWith('.json'));

  console.log('\nAvailable proposals:\n');
  files.forEach((f, i) => console.log(`${i + 1}. ${f}`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const index = await new Promise<number>(resolve => {
    rl.question('\nWhich proposal to post? ', answer => {
      rl.close();
      resolve(parseInt(answer, 10) - 1);
    });
  });

  return JSON.parse(
    fs.readFileSync(path.join(proposalsDir, files[index]), 'utf-8')
  );
}

async function postProposal(proposal: any) {
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
}

async function main() {
  const proposal = await chooseProposal();
  await postProposal(proposal);
}

main().catch(console.error);