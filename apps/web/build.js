const { execSync } = require('child_process');
const nextBin = require.resolve('next/dist/bin/next');
try {
  execSync(`node "${nextBin}" build`, { stdio: 'inherit' });
} catch (err) {
  process.exit(err.status || 1);
}
