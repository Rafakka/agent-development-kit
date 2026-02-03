import {ask} from '../cli/ask'
import { Actions } from '../app/actions.types';

export async function menu(actions:Actions)
  {
  console.log('\n===Small Gnosis CLI===');
  console.log('0) Exit.')
  console.log('1) Post a proposal to Moltbook.');
  console.log('2) Respond to post.');
  console.log('3) Track a post.');
  console.log('4) To get a post.');

  const choice = await ask('Choose:');
  
  switch (choice) {
    case '0': {
      console.log('Bye.');
      process.exit(0);
    }

    case '1' : {
      const title = await ask('Title: ');
      const submolt = await ask('Submolt: ');
      const content = await ask('Write your content: ');
      await actions.postProposal({title, submolt, content});
      break;
    }

    case '2': {
      const postId = await ask('Post ID: ');
      const content = await ask('Content:\n');
      await actions.respondToPost(postId, content);
      break;
    }

    case '3' : {
      const postId = await ask('Post ID: ');
      const title = await ask('Title: ');
      await actions.loadTracking(postId, title);
      break;

    }

    case '4' : {
      const postId = await ask('Post ID: ');
      await actions.getPost(postId);
      break;

    }

    default:
      console.log('invalid option');
  }
}