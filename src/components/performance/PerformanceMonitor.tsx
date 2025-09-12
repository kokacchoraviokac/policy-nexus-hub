import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Clock, 
  Eye, 
  Wifi,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { webVitalsMonitor, PerformanceMetrics } from '@/utils/performance/webVitals';

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    CLS: null,
    INP: null,
    FCP: null,
    LCP: null,
    TTFB: null,
  });
  const [overallScore, setOverallScore] = useState<number>(0);
  const [ratings, setRatings] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateMetrics = () => {
      const summary = webVitalsMonitor.getMetricsSummary();
      setMetrics(summary.metrics);
      setOverallScore(summary.overallScore);
      setRatings(summary.ratings);
    };

    // Update metrics immediately
    updateMetrics();

    // Set up periodic updates
    const interval = setInterval(updateMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  const getMetricIcon = (metricName: string) => {
    switch (metricName) {
      case 'CLS': return <Activity className="h-4 w-4" />;
      case 'INP': return <Zap className="h-4 w-4" />;
      case 'FCP': return <Eye className="h-4 w-4" />;
      case 'LCP': return <Clock className="h-4 w-4" />;
      case 'TTFB': return <Wifi className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getMetricDescription = (metricName: string) => {
    switch (metricName) {
      case 'CLS': return 'Cumulative Layout Shift';
      case 'INP': return 'Interaction to Next Paint';
      case 'FCP': return 'First Contentful Paint';
      case 'LCP': return 'Largest Contentful Paint';
      case 'TTFB': return 'Time to First Byte';
      default: return metricName;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'bg-green-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRatingVariant = (rating: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (rating) {
      case 'good': return 'default';
      case 'needs-improvement': return 'secondary';
      case 'poor': return 'destructive';
      default: return 'outline';
    }
  };

  const formatMetricValue = (metricName: string, value: number | null): string => {
    if (value === null) return 'N/A';
    
    switch (metricName) {
      case 'CLS':
        return value.toFixed(3);
      case 'INP':
      case 'FCP':
      case 'LCP':
      case 'TTFB':
        return `${Math.round(value)}ms`;
      default:
        return value.toString();
    }
  };

  const handleExportMetrics = () => {
    const data = webVitalsMonitor.exportMetrics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `web-vitals-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearMetrics = () => {
    webVitalsMonitor.clearMetrics();
    // Reset local state
    setMetrics({
      CLS: null,
      INP: null,
      FCP: null,
      LCP: null,
      TTFB: null,
    });
    setOverallScore(0);
    setRatings({});
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Web Vitals Performance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Score */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Overall Performance Score</h3>
                <p className="text-sm text-muted-foreground">
                  Based on Core Web Vitals metrics
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{overallScore}%</div>
                <Progress value={overallScore} className="w-24 mt-1" />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(metrics).map(([metricName, value]) => (
                <Card key={metricName} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getMetricIcon(metricName)}
                      <span className="font-medium">{metricName}</span>
                    </div>
                    {ratings[metricName] && (
                      <Badge variant={getRatingVariant(ratings[metricName])}>
                        {ratings[metricName]}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {formatMetricValue(metricName, value)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getMetricDescription(metricName)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
              <Button onClick={handleExportMetrics} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Metrics
              </Button>
              <Button onClick={handleClearMetrics} variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Data
              </Button>
            </div>

            {/* Development Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Development Mode:</strong> Metrics are logged to console. 
                  In production, they will be stored for analytics.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;