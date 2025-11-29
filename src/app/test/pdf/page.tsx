'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Cookies from 'js-cookie';

// Get API base URL - same as clientAxios uses
const getApiBaseUrl = () => {
  // Try to get from environment variable (exposed via next.config.mjs)
  if (typeof window !== 'undefined') {
    // Client-side: try NEXT_PUBLIC_ prefix first, then fallback
    return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3333';
  }
  return process.env.API_URL || 'http://localhost:3333';
};

const API_BASE_URL = getApiBaseUrl();

export default function PDFTestPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [customHTML, setCustomHTML] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Custom PDF</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #333;
      padding: 20px;
    }
    h1 {
      color: #364D9D;
      border-bottom: 2px solid #364D9D;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #364D9D;
      color: white;
    }
  </style>
</head>
<body>
  <h1>Custom Report</h1>
  <p>Generated on ${new Date().toLocaleDateString()}</p>
  <table>
    <tr>
      <th>Item</th>
      <th>Value</th>
    </tr>
    <tr>
      <td>Total</td>
      <td>$1,234.56</td>
    </tr>
    <tr>
      <td>Status</td>
      <td>Completed</td>
    </tr>
  </table>
</body>
</html>`);
  const [filename, setFilename] = useState('custom-report.pdf');

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const openBlobInNewTab = (blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Clean up after a delay
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  };

  const getAuthHeaders = (includeContentType = false) => {
    const accessToken = Cookies.get('accessToken');
    const headers: HeadersInit = {};
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return headers;
  };

  const handleTestPDF = async (openInTab = false) => {
    setLoading('test');
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pdf/test`, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      
      if (openInTab) {
        openBlobInNewTab(blob);
        setSuccess('PDF opened in new tab');
      } else {
        downloadBlob(blob, 'test.pdf');
        setSuccess('Test PDF downloaded successfully');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF';
      setError(errorMessage);
      console.error('Error downloading PDF:', err);
    } finally {
      setLoading(null);
    }
  };

  const handleTestReportPDF = async (openInTab = false) => {
    setLoading('test-report');
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pdf/test-report`, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      
      if (openInTab) {
        openBlobInNewTab(blob);
        setSuccess('Service report PDF opened in new tab');
      } else {
        downloadBlob(blob, 'service-report.pdf');
        setSuccess('Service report PDF downloaded successfully');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF';
      setError(errorMessage);
      console.error('Error downloading PDF:', err);
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateCustomPDF = async (openInTab = false) => {
    setLoading('custom');
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pdf/generate`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          html: customHTML,
          filename: filename,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate PDF' }));
        throw new Error(errorData.message || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      
      if (openInTab) {
        openBlobInNewTab(blob);
        setSuccess('Custom PDF opened in new tab');
      } else {
        downloadBlob(blob, filename);
        setSuccess('Custom PDF generated and downloaded successfully');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF';
      setError(errorMessage);
      console.error('Error generating PDF:', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">PDF Testing Interface</h1>
        <p className="text-slate-600">
          Test the PDF generation endpoints from your backend. All endpoints require authentication.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-900 dark:text-green-100">Success</AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Test PDF Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Test PDF
            </CardTitle>
            <CardDescription>
              Simple test PDF endpoint (GET /api/v1/pdf/test)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => handleTestPDF(false)}
                disabled={loading !== null}
                className="flex-1"
              >
                {loading === 'test' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleTestPDF(true)}
                disabled={loading !== null}
                variant="outline"
              >
                Open in Tab
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Report PDF Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Service Report PDF
            </CardTitle>
            <CardDescription>
              Service report PDF example (GET /api/v1/pdf/test-report)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => handleTestReportPDF(false)}
                disabled={loading !== null}
                className="flex-1"
              >
                {loading === 'test-report' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleTestReportPDF(true)}
                disabled={loading !== null}
                variant="outline"
              >
                Open in Tab
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom PDF Generation Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Custom PDF
          </CardTitle>
          <CardDescription>
            Generate PDF from custom HTML (POST /api/v1/pdf/generate)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="custom-report.pdf"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="html-content">HTML Content</Label>
            <Textarea
              id="html-content"
              value={customHTML}
              onChange={(e) => setCustomHTML(e.target.value)}
              rows={15}
              className="font-mono text-sm"
              placeholder="Enter your HTML content here..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleGenerateCustomPDF(false)}
              disabled={loading !== null}
              className="flex-1"
            >
              {loading === 'custom' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate & Download
                </>
              )}
            </Button>
            <Button
              onClick={() => handleGenerateCustomPDF(true)}
              disabled={loading !== null}
              variant="outline"
            >
              Generate & Open in Tab
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Info Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>API Information</CardTitle>
          <CardDescription>
            Backend API configuration and endpoint details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Base URL:</span>{' '}
              <code className="bg-slate-100 px-2 py-1 rounded">{API_BASE_URL}</code>
            </div>
            <div>
              <span className="font-semibold">Endpoints:</span>
              <ul className="list-disc list-inside mt-1 space-y-1 ml-4">
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">GET /api/v1/pdf/test</code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">GET /api/v1/pdf/test-report</code>
                </li>
                <li>
                  <code className="bg-slate-100 px-2 py-1 rounded">POST /api/v1/pdf/generate</code>
                </li>
              </ul>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-xs">
                <strong>Note:</strong> All endpoints require authentication. Make sure you're logged in and your session
                cookies are being sent with the requests.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

