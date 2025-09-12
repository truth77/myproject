const fs = require('fs');
const path = require('path');

// Paths to the version files
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const versionTxtPath = path.join(__dirname, '..', 'public', 'version.txt');

// Read current version from package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Update the version.txt file
fs.writeFileSync(versionTxtPath, currentVersion, 'utf8');

console.log(`Version updated to: ${currentVersion}`);
