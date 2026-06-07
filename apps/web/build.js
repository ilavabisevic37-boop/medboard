const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname);
const distDir = path.resolve(projectRoot, '../../dist/apps/web');

console.log('Building Next.js application...');
try {
  const cleanEnv = {
    ...process.env,
    NODE_ENV: 'production'
  };
  // Run Next.js build
  execSync('npx next build', {
    cwd: projectRoot,
    stdio: 'inherit',
    env: cleanEnv
  });
} catch (error) {
  console.error('Next.js build failed:', error);
  process.exit(1);
}

console.log('Cleaning target directory:', distDir);
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

const standaloneDir = path.join(projectRoot, '.next/standalone');

if (fs.existsSync(standaloneDir)) {
  console.log('Copying standalone build to dist...');
  try {
    // Copy the standalone output files (dereferencing symlinks to avoid EPERM on Windows)
    fs.cpSync(standaloneDir, distDir, {
      recursive: true,
      dereference: true,
      force: true
    });

    // Copy static files and public assets which Next standalone doesn't copy automatically
    const staticSrc = path.join(projectRoot, '.next/static');
    const staticDest = path.join(distDir, '.next/static');
    if (fs.existsSync(staticSrc)) {
      fs.mkdirSync(path.dirname(staticDest), { recursive: true });
      fs.cpSync(staticSrc, staticDest, { recursive: true, force: true });
    }

    const publicSrc = path.join(projectRoot, 'public');
    const publicDest = path.join(distDir, 'public');
    if (fs.existsSync(publicSrc)) {
      fs.cpSync(publicSrc, publicDest, { recursive: true, force: true });
    }

    console.log('Standalone build successfully copied to dist/apps/web.');
  } catch (err) {
    console.error('Error copying standalone files:', err);
    // Exit with code 0 on Windows local builds if it's just a copying warning, but fail on CI/CD
    process.exit(1);
  }
} else {
  console.log('Standalone build not found. Copying standard .next folder...');
  try {
    const nextSrc = path.join(projectRoot, '.next');
    const nextDest = path.join(distDir, '.next');
    fs.cpSync(nextSrc, nextDest, { recursive: true, force: true });

    const packageJsonSrc = path.join(projectRoot, 'package.json');
    const packageJsonDest = path.join(distDir, 'package.json');
    if (fs.existsSync(packageJsonSrc)) {
      fs.copyFileSync(packageJsonSrc, packageJsonDest);
    }

    const publicSrc = path.join(projectRoot, 'public');
    const publicDest = path.join(distDir, 'public');
    if (fs.existsSync(publicSrc)) {
      fs.cpSync(publicSrc, publicDest, { recursive: true, force: true });
    }

    console.log('Standard build successfully copied to dist/apps/web.');
  } catch (err) {
    console.error('Error copying build files:', err);
    process.exit(1);
  }
}
