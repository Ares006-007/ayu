const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = fs.readdirSync(dir);
  files.forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.ts')) {
      let txt = fs.readFileSync(p, 'utf8');
      // replace "from './something'" with "from './something.js'"
      let fixed = txt.replace(/from\s+['"](\.[^'"]+)['"]/g, (m, p1) => {
        if (!p1.endsWith('.js')) {
          return `from '${p1}.js'`;
        }
        return m;
      });
      if (fixed !== txt) {
        fs.writeFileSync(p, fixed);
        console.log('Fixed', p);
      }
    }
  });
}

walk('apps/api/src');
