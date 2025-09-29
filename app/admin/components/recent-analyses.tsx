"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, Clock, Search, Eye, Filter } from "lucide-react"

interface Analysis {
  id: string
  timestamp: string
  result: "phishing" | "legitimate" | "suspicious"
  confidence: number
  riskLevel: "low" | "medium" | "high"
  indicators: string[]
  userAgent: string
  ipAddress: string
}

interface RecentAnalysesProps {
  analyses: Analysis[]
}

export function RecentAnalyses({ analyses }: RecentAnalysesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterResult, setFilterResult] = useState("all")
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)

  // Mock data for recent analyses
  // const analyses: Analysis[] = [
  //   {
  //     id: "ANL-2024-001847",
  //     timestamp: "2024-01-15T14:32:18Z",
  //     result: "phishing",
  //     confidence: 94.2,
  //     riskLevel: "high",
  //     indicators: ["Suspicious URLs", "Urgent Language", "Credential Requests"],
  //     userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  //     ipAddress: "192.168.1.***",
  //   },
  //   {
  //     id: "ANL-2024-001846",
  //     timestamp: "2024-01-15T14:28:45Z",
  //     result: "legitimate",
  //     confidence: 12.1,
  //     riskLevel: "low",
  //     indicators: [],
  //     userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  //     ipAddress: "10.0.0.***",
  //   },
  //   {
  //     id: "ANL-2024-001845",
  //     timestamp: "2024-01-15T14:25:12Z",
  //     result: "suspicious",
  //     confidence: 67.8,
  //     riskLevel: "medium",
  //     indicators: ["Generic Greetings", "Spelling Errors"],
  //     userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
  //     ipAddress: "172.16.0.***",
  //   },
  //   {
  //     id: "ANL-2024-001844",
  //     timestamp: "2024-01-15T14:22:33Z",
  //     result: "phishing",
  //     confidence: 89.5,
  //     riskLevel: "high",
  //     indicators: ["Suspicious URLs", "Financial Threats", "Impersonation"],
  //     userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  //     ipAddress: "203.0.113.***",
  //   },
  //   {
  //     id: "ANL-2024-001843",
  //     timestamp: "2024-01-15T14:19:07Z",
  //     result: "legitimate",
  //     confidence: 8.3,
  //     riskLevel: "low",
  //     indicators: [],
  //     userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
  //     ipAddress: "198.51.100.***",
  //   },
  // ]

  const getResultIcon = (result: string) => {
    switch (result) {
      case "phishing":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "legitimate":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "suspicious":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "phishing":
        return "bg-red-100 text-red-800"
      case "legitimate":
        return "bg-green-100 text-green-800"
      case "suspicious":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch =
      analysis.id.toLowerCase().includes(searchTerm.toLowerCase()) || analysis.ipAddress.includes(searchTerm)
    const matchesFilter = filterResult === "all" || analysis.result === filterResult
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by Analysis ID or IP address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterResult} onValueChange={setFilterResult}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="phishing">Phishing Only</SelectItem>
                <SelectItem value="legitimate">Legitimate Only</SelectItem>
                <SelectItem value="suspicious">Suspicious Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recent Analyses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Email Analyses</CardTitle>
          <CardDescription>Latest email analysis results and system activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAnalyses.map((analysis) => (
              <div key={analysis.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getResultIcon(analysis.result)}
                    <div>
                      <div className="font-medium">{analysis.id}</div>
                      <div className="text-sm text-gray-600">{formatTimestamp(analysis.timestamp)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getResultColor(analysis.result)}>{analysis.result.toUpperCase()}</Badge>
                    <Button variant="outline" size="sm" onClick={() => setSelectedAnalysis(analysis)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Confidence:</span>
                    <div className="font-medium">{analysis.confidence.toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Risk Level:</span>
                    <div className={`font-medium ${getRiskColor(analysis.riskLevel)}`}>
                      {analysis.riskLevel.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Indicators:</span>
                    <div className="font-medium">{analysis.indicators.length} found</div>
                  </div>
                  <div>
                    <span className="text-gray-600">IP Address:</span>
                    <div className="font-medium font-mono">{analysis.ipAddress}</div>
                  </div>
                </div>

                {analysis.indicators.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-gray-600 mb-2">Detected Indicators:</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.indicators.map((indicator, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredAnalyses.length === 0 && (
            <div className="text-center py-8 text-gray-500">No analyses found matching your criteria.</div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Detail Modal */}
      {selectedAnalysis && (
        <Card className="fixed inset-4 z-50 bg-white shadow-2xl overflow-auto">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Analysis Details: {selectedAnalysis.id}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setSelectedAnalysis(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Analysis Result</h4>
                  <div className="flex items-center space-x-2">
                    {getResultIcon(selectedAnalysis.result)}
                    <Badge className={getResultColor(selectedAnalysis.result)}>
                      {selectedAnalysis.result.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Confidence Score</h4>
                  <div className="text-2xl font-bold">{selectedAnalysis.confidence.toFixed(1)}%</div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Risk Level</h4>
                  <div className={`text-lg font-medium ${getRiskColor(selectedAnalysis.riskLevel)}`}>
                    {selectedAnalysis.riskLevel.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Timestamp</h4>
                  <div className="font-mono">{formatTimestamp(selectedAnalysis.timestamp)}</div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">IP Address</h4>
                  <div className="font-mono">{selectedAnalysis.ipAddress}</div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">User Agent</h4>
                  <div className="text-sm font-mono break-all">{selectedAnalysis.userAgent}</div>
                </div>
              </div>
            </div>
            {selectedAnalysis.indicators.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Detected Indicators</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedAnalysis.indicators.map((indicator, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
