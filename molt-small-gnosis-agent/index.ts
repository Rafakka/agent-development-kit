import 'dotenv/config';
import { menu } from './cli/menu';
import { createMoltBookClient } from './core/moltbookClient';
import { createActions } from './app/actions';

async function main() {
    const apiKey = process.env.MOLTBOOK_API_KEY;

    if (!apiKey) {
        throw new Error ('Missing API Key');
        }

    const client = createMoltBookClient(apiKey);
    const actions = createActions(client);

    await menu(actions);
    }
    
main().catch(console.error);