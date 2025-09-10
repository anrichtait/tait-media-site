/**
 * Performance Monitoring Utilities for Tait Media Solutions
 * Tracks Core Web Vitals and provides optimization insights
 */

// Types for performance metrics
export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

export interface WebVitalsReport {
  fcp?: PerformanceMetric; // First Contentful Paint
  lcp?: PerformanceMetric; // Largest Contentful Paint
  fid?: PerformanceMetric; // First Input Delay
  cls?: PerformanceMetric; // Cumulative Layout Shift
  ttfb?: PerformanceMetric; // Time to First Byte
  inp?: PerformanceMetric; // Interaction to Next Paint (replacing FID)
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  fcp: { good: 1800, poor: 3000 },
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  ttfb: { good: 800, poor: 1800 },
  inp: { good: 200, poor: 500 }
};

/**
 * Rate a metric value based on thresholds
 */
function rateMetric(name: keyof typeof THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Create a performance metric object
 */
function createMetric(name: string, value: number): PerformanceMetric {
  return {
    name,
    value,
    rating: rateMetric(name as keyof typeof THRESHOLDS, value),
    timestamp: Date.now()
  };
}

/**
 * Initialize Core Web Vitals monitoring
 */
export function initWebVitalsMonitoring(
  onReport: (report: WebVitalsReport) => void,
  options: {
    reportAllChanges?: boolean;
    analyticsId?: string;
  } = {}
) {
  const report: WebVitalsReport = {};
  const { reportAllChanges = false } = options;

  // First Contentful Paint
  const fcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      report.fcp = createMetric('fcp', fcpEntry.startTime);
      onReport(report);
    }
  });

  if (typeof PerformanceObserver !== 'undefined' && 'observe' in fcpObserver) {
    try {
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.warn('FCP observation not supported');
    }
  }

  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    if (lastEntry) {
      report.lcp = createMetric('lcp', lastEntry.startTime);
      if (reportAllChanges || !document.hidden) {
        onReport(report);
      }
    }
  });

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('LCP observation not supported');
  }

  // First Input Delay / Interaction to Next Paint
  const inputObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    for (const entry of entries) {
      if (entry.processingStart && entry.startTime) {
        const delay = entry.processingStart - entry.startTime;
        // Check if it's INP (newer metric) or FID (legacy)
        const metricName = 'duration' in entry ? 'inp' : 'fid';
        const value = 'duration' in entry ? entry.duration : delay;
        
        report[metricName] = createMetric(metricName, value);
        onReport(report);
      }
    }
  });

  try {
    // Try INP first (newer browsers)
    inputObserver.observe({ type: 'event', buffered: true });
  } catch (e) {
    try {
      // Fallback to FID
      inputObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('Input delay observation not supported');
    }
  }

  // Cumulative Layout Shift
  let clsValue = 0;
  let clsEntries: PerformanceEntry[] = [];
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        clsEntries.push(entry);
      }
    }
    report.cls = createMetric('cls', clsValue);
    if (reportAllChanges) {
      onReport(report);
    }
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    console.warn('CLS observation not supported');
  }

  // Time to First Byte
  const navigationEntries = performance.getEntriesByType('navigation');
  if (navigationEntries.length > 0) {
    const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
    const ttfb = navEntry.responseStart - navEntry.requestStart;
    report.ttfb = createMetric('ttfb', ttfb);
    onReport(report);
  }

  // Send final report on page visibility change
  const sendFinalReport = () => {
    if (report.cls) {
      onReport(report);
    }
  };

  document.addEventListener('visibilitychange', sendFinalReport);
  window.addEventListener('beforeunload', sendFinalReport);

  return {
    disconnect: () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      inputObserver.disconnect();
      clsObserver.disconnect();
      document.removeEventListener('visibilitychange', sendFinalReport);
      window.removeEventListener('beforeunload', sendFinalReport);
    }
  };
}

/**
 * Send Web Vitals data to analytics
 */
export function sendToAnalytics(report: WebVitalsReport, analyticsId?: string) {
  if (typeof gtag !== 'undefined' && analyticsId) {
    Object.entries(report).forEach(([key, metric]) => {
      if (metric) {
        gtag('event', key, {
          event_category: 'Web Vitals',
          event_label: metric.rating,
          value: Math.round(metric.value),
          custom_parameter_1: analyticsId,
          non_interaction: true
        });
      }
    });
  }

  // Also send to custom analytics endpoint if needed
  if (typeof fetch !== 'undefined') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...report,
        url: location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })
    }).catch(() => {
      // Silently fail - don't break user experience
    });
  }
}

/**
 * Performance budget checker
 */
export interface PerformanceBudget {
  lcp: number; // ms
  fid: number; // ms
  cls: number; // score
  fcp: number; // ms
  ttfb: number; // ms
  bundleSize: number; // bytes
  imageCount: number;
  scriptCount: number;
}

const DEFAULT_BUDGET: PerformanceBudget = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  ttfb: 800,
  bundleSize: 200000, // 200kb
  imageCount: 20,
  scriptCount: 10
};

export function checkPerformanceBudget(
  report: WebVitalsReport,
  budget: Partial<PerformanceBudget> = {}
): { passed: boolean; violations: string[] } {
  const fullBudget = { ...DEFAULT_BUDGET, ...budget };
  const violations: string[] = [];

  // Check Core Web Vitals
  if (report.lcp && report.lcp.value > fullBudget.lcp) {
    violations.push(`LCP exceeded budget: ${report.lcp.value}ms > ${fullBudget.lcp}ms`);
  }

  if (report.fid && report.fid.value > fullBudget.fid) {
    violations.push(`FID exceeded budget: ${report.fid.value}ms > ${fullBudget.fid}ms`);
  }

  if (report.cls && report.cls.value > fullBudget.cls) {
    violations.push(`CLS exceeded budget: ${report.cls.value} > ${fullBudget.cls}`);
  }

  if (report.fcp && report.fcp.value > fullBudget.fcp) {
    violations.push(`FCP exceeded budget: ${report.fcp.value}ms > ${fullBudget.fcp}ms`);
  }

  if (report.ttfb && report.ttfb.value > fullBudget.ttfb) {
    violations.push(`TTFB exceeded budget: ${report.ttfb.value}ms > ${fullBudget.ttfb}ms`);
  }

  // Check resource counts
  const images = document.querySelectorAll('img').length;
  if (images > fullBudget.imageCount) {
    violations.push(`Too many images: ${images} > ${fullBudget.imageCount}`);
  }

  const scripts = document.querySelectorAll('script').length;
  if (scripts > fullBudget.scriptCount) {
    violations.push(`Too many scripts: ${scripts} > ${fullBudget.scriptCount}`);
  }

  return {
    passed: violations.length === 0,
    violations
  };
}

/**
 * Resource loading performance tracker
 */
export function trackResourcePerformance() {
  const resourceMetrics: {
    [key: string]: {
      count: number;
      totalSize: number;
      averageLoadTime: number;
      slowest: number;
    }
  } = {};

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    
    entries.forEach((entry) => {
      if ('transferSize' in entry) {
        const resourceEntry = entry as PerformanceResourceTiming;
        const type = getResourceType(resourceEntry.name);
        const loadTime = resourceEntry.responseEnd - resourceEntry.startTime;
        
        if (!resourceMetrics[type]) {
          resourceMetrics[type] = {
            count: 0,
            totalSize: 0,
            averageLoadTime: 0,
            slowest: 0
          };
        }
        
        const metric = resourceMetrics[type];
        metric.count++;
        metric.totalSize += resourceEntry.transferSize || 0;
        metric.averageLoadTime = (metric.averageLoadTime * (metric.count - 1) + loadTime) / metric.count;
        metric.slowest = Math.max(metric.slowest, loadTime);
      }
    });
  });

  try {
    observer.observe({ type: 'resource', buffered: true });
  } catch (e) {
    console.warn('Resource timing observation not supported');
  }

  return {
    getMetrics: () => resourceMetrics,
    disconnect: () => observer.disconnect()
  };
}

/**
 * Determine resource type from URL
 */
function getResourceType(url: string): string {
  if (url.match(/\.(css)(\?|$)/)) return 'css';
  if (url.match(/\.(js|ts)(\?|$)/)) return 'script';
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/)) return 'image';
  if (url.match(/\.(woff|woff2|ttf|eot)(\?|$)/)) return 'font';
  if (url.match(/\.(mp4|webm|ogg|avi)(\?|$)/)) return 'video';
  return 'other';
}

/**
 * Image optimization tracker
 */
export function trackImageOptimization() {
  const images = document.querySelectorAll('img');
  const issues: string[] = [];

  images.forEach((img, index) => {
    // Check for missing alt text
    if (!img.alt) {
      issues.push(`Image ${index + 1}: Missing alt text`);
    }

    // Check for lazy loading
    if (!img.loading || img.loading !== 'lazy') {
      issues.push(`Image ${index + 1}: Not using lazy loading`);
    }

    // Check for responsive images
    if (!img.srcset) {
      issues.push(`Image ${index + 1}: No responsive srcset`);
    }

    // Check for modern formats
    const src = img.src || img.currentSrc;
    if (src && !src.match(/\.(webp|avif)(\?|$)/)) {
      issues.push(`Image ${index + 1}: Not using modern format (WebP/AVIF)`);
    }
  });

  return {
    totalImages: images.length,
    issues,
    score: Math.max(0, 100 - (issues.length * 10))
  };
}

/**
 * Initialize complete performance monitoring
 */
export function initPerformanceMonitoring(options: {
  analyticsId?: string;
  budget?: Partial<PerformanceBudget>;
  onReport?: (data: any) => void;
} = {}) {
  const performanceData: any = {};

  // Web Vitals monitoring
  const vitalsMonitor = initWebVitalsMonitoring((report) => {
    performanceData.webVitals = report;
    
    if (options.analyticsId) {
      sendToAnalytics(report, options.analyticsId);
    }

    // Check performance budget
    const budgetCheck = checkPerformanceBudget(report, options.budget);
    performanceData.budgetCheck = budgetCheck;

    // Log budget violations in development
    if (!budgetCheck.passed && process.env.NODE_ENV === 'development') {
      console.warn('Performance Budget Violations:', budgetCheck.violations);
    }

    options.onReport?.(performanceData);
  });

  // Resource performance monitoring
  const resourceMonitor = trackResourcePerformance();

  // Image optimization check
  if (document.readyState === 'complete') {
    performanceData.imageOptimization = trackImageOptimization();
  } else {
    window.addEventListener('load', () => {
      performanceData.imageOptimization = trackImageOptimization();
      options.onReport?.(performanceData);
    });
  }

  return {
    getPerformanceData: () => performanceData,
    disconnect: () => {
      vitalsMonitor.disconnect();
      resourceMonitor.disconnect();
    }
  };
}