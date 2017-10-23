const fs = require('fs');
const path = require('path');

const DIST_PATH = path.join(__dirname, '../dist');
const DEFS_PATH = path.join(__dirname, '../typedefs');

const flow = fs.readFileSync(path.join(DEFS_PATH, 't8on.js.flow'), 'utf-8');
const ts = fs.readFileSync(path.join(DEFS_PATH, 't8on.d.ts'), 'utf-8');

fs.writeFileSync(path.join(DIST_PATH, 't8on.js.flow'), flow, 'utf-8');
fs.writeFileSync(path.join(DIST_PATH, 't8on.d.ts'), ts, 'utf-8');
