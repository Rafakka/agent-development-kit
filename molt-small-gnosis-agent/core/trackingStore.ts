import fs from 'fs';
import path from 'path';
import { TrackingRecord } from './types';

const DIR = path.join(process.cwd(), 'tracking');

export function loadTracking(): TrackingRecord[] {
    if (!fs.existsSync(DIR)) return [];

    return fs.readdirSync(DIR)
    .filter(f => f.endsWith('.track.json'))
    .map(f => 
        JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf-8'))
    );
}

export function saveTracking (record:TrackingRecord) {
    if (!fs.existsSync(DIR)) fs.mkdirSync(DIR);

    const file = path.join(DIR,`${record.post_id}.track.json`);
    fs.writeFileSync(file, JSON.stringify(record, null, 2));
}