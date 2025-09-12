import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

interface PerformanceMetrics {
  CLS: number | null; // Cumulative Layout Shift
  INP: number | null; // Interaction to Next Paint (replaces FID)
  FCP: number | null; // First Contentful Paint
  LCP: number | null; // Largest Contentful Paint
  TTFB: number | null; // Time to First Byte
}

interface PerformanceConfig {
  enableConsoleLogging: boolean;
  enableAnalytics: boolean;
  thresholds: {
    CLS: { good: number; needsImprovement: number };
    INP: { good: number; needsImprovement: number };
    FCP: { good: number; needsImprovement: number };
    LCP: { good: number; needsImprovement: number };
    TTFB: { good: number; needsImprovement: number };
  };
}

const defaultConfig: PerformanceConfig = {
  enableConsoleLogging: process.env.NODE_ENV === 'development',
  enableAnalytics: process.env.NODE_ENV === 'production',
  thresholds: {
    CLS: { good: 0.1, needsImprovement: 0.25 },
    INP: { good: 200, needsImprovement: 500 },
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    TTFB: { good: 800, needsImprovement: 1800 },
  },
};

class WebVitalsMonitor {
  private metrics: PerformanceMetrics = {
    CLS: null,
    INP: null,
    FCP: null,
    LCP: null,
    TTFB: null,
  };

  private config: PerformanceConfig;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    onCLS(this.handleMetric.bind(this));
    onINP(this.handleMetric.bind(this));
    onFCP(this.handleMetric.bind(this));
    onLCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));
  }

  private handleMetric(metric: Metric): void {
    const { name, value } = metric;
    
    // Store the metric
    this.metrics[name as keyof PerformanceMetrics] = value;

    // Log to console in development
    if (this.config.enableConsoleLogging) {
      const rating = this.getRating(name as keyof PerformanceMetrics, value);
      console.log(`🔍 Web Vital: ${name}`, {
        value: Math.round(value * 100) / 100,
        rating,
        threshold: this.config.thresholds[name as keyof PerformanceMetrics],
      });
    }

    // Send to analytics in production
    if (this.config.enableAnalytics) {
      this.sendToAnalytics(metric);
    }
  }

  private getRating(metricName: keyof PerformanceMetrics, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.config.thresholds[metricName];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  private sendToAnalytics(metric: Metric): void {
    // In a real application, you would send this to your analytics service
    // For now, we'll just store it in localStorage for debugging
    try {
      const existingMetrics = JSON.parse(localStorage.getItem('webVitalsMetrics') || '[]');
      existingMetrics.push({
        ...metric,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        rating: this.getRating(metric.name as keyof PerformanceMetrics, metric.value),
      });
      
      // Keep only the last 100 metrics
      if (existingMetrics.length > 100) {
        existingMetrics.splice(0, existingMetrics.length - 100);
      }
      
      localStorage.setItem('webVitalsMetrics', JSON.stringify(existingMetrics));
    } catch (error) {
      console.warn('Failed to store Web Vitals metrics:', error);
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getMetricsSummary(): {
    metrics: PerformanceMetrics;
    ratings: Record<keyof PerformanceMetrics, string>;
    overallScore: number;
  } {
    const ratings: Record<keyof PerformanceMetrics, string> = {} as any;
    let goodCount = 0;
    let totalCount = 0;

    Object.entries(this.metrics).forEach(([key, value]) => {
      if (value !== null) {
        const rating = this.getRating(key as keyof PerformanceMetrics, value);
        ratings[key as keyof PerformanceMetrics] = rating;
        if (rating === 'good') goodCount++;
        totalCount++;
      }
    });

    const overallScore = totalCount > 0 ? Math.round((goodCount / totalCount) * 100) : 0;

    return {
      metrics: this.getMetrics(),
      ratings,
      overallScore,
    };
  }

  public exportMetrics(): string {
    try {
      const storedMetrics = localStorage.getItem('webVitalsMetrics');
      return storedMetrics || '[]';
    } catch (error) {
      console.warn('Failed to export Web Vitals metrics:', error);
      return '[]';
    }
  }

  public clearMetrics(): void {
    try {
      localStorage.removeItem('webVitalsMetrics');
      console.log('Web Vitals metrics cleared');
    } catch (error) {
      console.warn('Failed to clear Web Vitals metrics:', error);
    }
  }
}

// Create singleton instance
export const webVitalsMonitor = new WebVitalsMonitor();

// Export for manual initialization with custom config
export { WebVitalsMonitor };

// Export types
export type { PerformanceMetrics, PerformanceConfig };