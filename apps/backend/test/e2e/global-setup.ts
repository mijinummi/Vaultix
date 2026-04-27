import { execSync } from 'child_process';

async function globalSetup() {
  // Reset DB
  execSync('npm run db:test:reset', { stdio: 'inherit' });

  // Seed DB
  execSync('npm run db:test:seed', { stdio: 'inherit' });

  // Start app
  execSync('npm run start:test &', { stdio: 'inherit' });

  // wait briefly for server
  await new Promise((r) => setTimeout(r, 4000));
}

export default globalSetup;