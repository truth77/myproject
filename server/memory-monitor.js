const fs = require('fs');
const path = require('path');
const { performance, PerformanceObserver } = require('perf_hooks');
const v8 = require('v8');

// Only run in development and if not explicitly disabled
if (process.env.NODE_ENV === 'development' && process.env.DISABLE_MEMORY_MONITORING !== 'true') {
  const LOG_INTERVAL = 60000; // 1 minute
  const LOG_FILE = path.join(__dirname, 'memory-usage.log');
  
  // Write header to log file
  const header = 'Timestamp, RSS (MB), Heap Total (MB), Heap Used (MB), External (MB), Array Buffers (MB), Garbage Collection (ms)\n';
  
  try {
    if (!fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, header);
    }
  } catch (err) {
    console.error('Error initializing memory log file:', err);
  }

  // Track garbage collection
  const obs = new PerformanceObserver((list) => {
    const entry = list.getEntries()[0];
    const gcTime = entry.duration;
    logMemoryUsage(gcTime);
  });
  
  obs.observe({ entryTypes: ['gc'], buffered: true });

  // Log memory usage at regular intervals
  setInterval(() => logMemoryUsage(), LOG_INTERVAL);

  // Log memory usage to file
  function logMemoryUsage(gcTime = 0) {
    const memory = process.memoryUsage();
    const stats = v8.getHeapStatistics();
    
    const data = [
      new Date().toISOString(),
      (memory.rss / 1024 / 1024).toFixed(2),
      (memory.heapTotal / 1024 / 1024).toFixed(2),
      (memory.heapUsed / 1024 / 1024).toFixed(2),
      (memory.external / 1024 / 1024).toFixed(2),
      (memory.arrayBuffers / 1024 / 1024).toFixed(2),
      gcTime.toFixed(2)
    ].join(', ') + '\n';
    
    fs.appendFile(LOG_FILE, data, (err) => {
      if (err) console.error('Error writing to memory log:', err);
    });
  }

  // Log unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    logMemoryUsage();
  });

  // Log uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    logMemoryUsage();
    process.exit(1);
  });

  console.log('Memory monitoring started. Logging to', LOG_FILE);
} else if (process.env.DISABLE_MEMORY_MONITORING === 'true') {
  console.log('Memory monitoring is disabled via DISABLE_MEMORY_MONITORING environment variable');
}
