// This is a stub file to prevent errors when the memory profiler is not available
// In a production environment, this would be replaced with actual memory profiling code

// Export a no-op function
export default function initMemoryProfiler() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Memory profiler initialized');
  }
}

// Call the function immediately
initMemoryProfiler();
