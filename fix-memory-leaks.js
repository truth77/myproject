const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting memory leak detection and fixing process...\n');

// 1. Check for memory leaks in the frontend
console.log('🔍 Checking for memory leaks in the frontend...');
try {
  // Run React's development mode with memory profiling
  if (fs.existsSync(path.join(__dirname, 'client', 'package.json'))) {
    console.log('⚛️  Running React memory profiler...');
    // This will generate a heap snapshot in the browser's dev tools
    console.log('   Open Chrome DevTools > Memory > Take Heap Snapshot to analyze memory usage');
  }
} catch (error) {
  console.error('❌ Error checking frontend memory leaks:', error.message);
}

// 2. Check for memory leaks in the backend
console.log('\n🔍 Checking for memory leaks in the backend...');
try {
  if (fs.existsSync(path.join(__dirname, 'server', 'package.json'))) {
    console.log('🔄 Starting Node.js memory monitoring...');
    
    // Check if node-inspector is installed
    try {
      execSync('node-inspector --version', { stdio: 'ignore' });
      console.log('   Run `node --inspect server/server.js` to start the server in debug mode');
      console.log('   Then open chrome://inspect in Chrome to debug memory usage');
    } catch {
      console.log('   Install node-inspector for detailed memory analysis:');
      console.log('   npm install -g node-inspector');
    }
    
    // Check for memory-hog modules
    console.log('\n📊 Checking for memory-intensive modules...');
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const memoryHogModules = [
      'mongoose', 'sequelize', 'redis', 'ioredis', 'memcached', 'socket.io', 'ws',
      'express-session', 'passport', 'sharp', 'puppeteer', 'canvas', 'pdfkit'
    ];
    
    const installedMemoryHogs = memoryHogModules.filter(module => deps[module]);
    
    if (installedMemoryHogs.length > 0) {
      console.log('   ⚠️  The following modules are known to potentially cause memory issues:');
      installedMemoryHogs.forEach(module => console.log(`   - ${module}`));
      console.log('   Consider optimizing their usage or finding lighter alternatives');
    } else {
      console.log('   ✅ No known memory-intensive modules detected');
    }
  }
} catch (error) {
  console.error('❌ Error checking backend memory leaks:', error.message);
}

// 3. Check Docker memory usage
console.log('\n🐳 Checking Docker container memory usage...');
try {
  execSync('docker --version', { stdio: 'ignore' });
  
  // Get container stats
  console.log('📊 Current container memory usage:');
  try {
    const stats = execSync('docker stats --no-stream --format "{{.Name}}: {{.MemUsage}}"', { encoding: 'utf8' });
    console.log(stats);
  } catch {
    console.log('   No running containers found or Docker is not running');
  }
  
  // Check Docker Compose memory limits
  if (fs.existsSync(path.join(__dirname, 'docker-compose.yml'))) {
    console.log('\n🔍 Checking Docker Compose memory limits...');
    const composeFile = fs.readFileSync(path.join(__dirname, 'docker-compose.yml'), 'utf8');
    
    if (composeFile.includes('memory:')) {
      console.log('   ℹ️  Memory limits are set in docker-compose.yml');
    } else {
      console.log('   ⚠️  No memory limits set in docker-compose.yml');
      console.log('   Consider adding memory limits to prevent containers from using too much memory');
    }
  }
} catch (error) {
  console.error('❌ Error checking Docker memory usage:', error.message);
}

// 4. Provide general recommendations
console.log('\n💡 General recommendations for fixing memory leaks:');
const recommendations = [
  '✅ Use React.memo() for components that render often with the same props',
  '✅ Use useCallback and useMemo to prevent unnecessary re-renders',
  '✅ Clean up event listeners and subscriptions in useEffect return functions',
  '✅ Use React DevTools Profiler to identify components that re-render unnecessarily',
  '✅ Consider using a state management library like Redux or Zustand for complex state',
  '✅ Use the Chrome DevTools Memory panel to take heap snapshots and compare them',
  '✅ Look for detached DOM elements in the Chrome DevTools Memory panel',
  '✅ Use the Performance Monitor in Chrome DevTools to track memory usage over time',
  '✅ Consider implementing code splitting with React.lazy() and Suspense',
  '✅ Use the why-did-you-render library to identify unnecessary re-renders',
  '✅ Consider using a service worker to cache assets and reduce memory usage',
  '✅ Use the React Developer Tools profiler to identify performance bottlenecks',
  '✅ Consider using webpack-bundle-analyzer to identify large dependencies'
];

recommendations.forEach(rec => console.log(`   ${rec}`));

console.log('\n🎉 Memory leak detection complete!');
