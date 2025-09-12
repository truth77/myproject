// Memory profiler for development
// Add this to your main index.js file: import './memory-profiler';

if (process.env.NODE_ENV === 'development') {
  const report = () => {
    const { rss, heapUsed, heapTotal } = process.memoryUsage();
    console.log('Memory Usage:');
    console.log(`RSS: ${(rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Heap Used: ${(heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Heap Total: ${(heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log('---');
  };

  // Log memory usage every 5 seconds
  setInterval(report, 5000);

  // Log memory usage on navigation
  if (window.performance) {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
      originalPushState.apply(this, arguments);
      report();
    };

    history.replaceState = function () {
      originalReplaceState.apply(this, arguments);
      report();
    };

    window.addEventListener('popstate', report);
  }
}
