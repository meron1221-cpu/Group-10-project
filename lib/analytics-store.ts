// In-memory store for analytics data
interface AnalysisRecord {
  id: string
  timestamp: string
  result: "phishing" | "legitimate" | "suspicious"
  confidence: number
  riskLevel: "low" | "medium" | "high"
  indicators: string[]
  userAgent: string
  ipAddress: string
  emailContent?: string // Optional, for privacy we might not store this
}

interface SystemMetrics {
  timestamp: string
  cpuUsage: number
  memoryUsage: number
  responseTime: number
  activeConnections: number
}

class AnalyticsStore {
  private analyses: AnalysisRecord[] = []
  private systemMetrics: SystemMetrics[] = []
  private startTime: Date = new Date()

  // Add a new analysis result
  addAnalysis(analysis: Omit<AnalysisRecord, "id" | "timestamp">) {
    const record: AnalysisRecord = {
      id: `ANL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...analysis,
    }

    this.analyses.push(record)

    // Keep only last 10000 records to prevent memory issues
    if (this.analyses.length > 10000) {
      this.analyses = this.analyses.slice(-10000)
    }

    return record
  }

  // Add system metrics
  addSystemMetrics(metrics: Omit<SystemMetrics, "timestamp">) {
    const record: SystemMetrics = {
      timestamp: new Date().toISOString(),
      ...metrics,
    }

    this.systemMetrics.push(record)

    // Keep only last 1000 metrics records
    if (this.systemMetrics.length > 1000) {
      this.systemMetrics = this.systemMetrics.slice(-1000)
    }
  }

  // Get all analyses
  getAnalyses(limit?: number): AnalysisRecord[] {
    const sorted = [...this.analyses].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    return limit ? sorted.slice(0, limit) : sorted
  }

  // Get analyses within date range
  getAnalysesByDateRange(startDate: Date, endDate: Date): AnalysisRecord[] {
    return this.analyses.filter((analysis) => {
      const analysisDate = new Date(analysis.timestamp)
      return analysisDate >= startDate && analysisDate <= endDate
    })
  }

  // Get dashboard statistics
  getDashboardStats() {
    try {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      const totalAnalyses = this.analyses?.length || 0
      const phishingDetected = this.analyses?.filter((a) => a?.result === "phishing")?.length || 0
      const legitimateEmails = this.analyses?.filter((a) => a?.result === "legitimate")?.length || 0
      const dailyAnalyses =
        this.analyses?.filter((a) => {
          try {
            return a?.timestamp && new Date(a.timestamp) >= today
          } catch {
            return false
          }
        })?.length || 0

      const confidenceScores =
        this.analyses?.map((a) => a?.confidence)?.filter((c) => typeof c === "number" && c > 0) || []

      const averageConfidence =
        confidenceScores.length > 0 ? confidenceScores.reduce((sum, c) => sum + c, 0) / confidenceScores.length : 0

      // Calculate uptime
      const systemUptime = 99.8 // Simulated, in real system this would be calculated

      // Get recent metrics for response time
      const recentMetrics = this.systemMetrics?.slice(-10) || []
      const responseTime =
        recentMetrics.length > 0
          ? recentMetrics.reduce((sum, m) => sum + (m?.responseTime || 0), 0) / recentMetrics.length
          : 0.8

      // Estimate active users (unique IPs in last 24 hours)
      const activeUsers = new Set(
        this.analyses
          ?.filter((a) => {
            try {
              return a?.timestamp && new Date(a.timestamp) >= new Date(now.getTime() - 24 * 60 * 60 * 1000)
            } catch {
              return false
            }
          })
          ?.map((a) => a?.ipAddress)
          ?.filter(Boolean) || [],
      ).size

      return {
        totalAnalyses,
        phishingDetected,
        legitimateEmails,
        averageConfidence: Math.round(averageConfidence * 10) / 10,
        systemUptime,
        responseTime: Math.round(responseTime * 10) / 10,
        activeUsers,
        dailyAnalyses,
      }
    } catch (error) {
      console.error("Error calculating dashboard stats:", error)
      return {
        totalAnalyses: 0,
        phishingDetected: 0,
        legitimateEmails: 0,
        averageConfidence: 0,
        systemUptime: 99.8,
        responseTime: 0.8,
        activeUsers: 0,
        dailyAnalyses: 0,
      }
    }
  }

  // Get trend data for charts
  getTrendData(days = 30) {
    try {
      const now = new Date()
      const trendData = []

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

        const dayAnalyses =
          this.analyses?.filter((a) => {
            try {
              if (!a?.timestamp) return false
              const analysisDate = new Date(a.timestamp)
              return analysisDate >= dayStart && analysisDate < dayEnd
            } catch {
              return false
            }
          }) || []

        const phishing = dayAnalyses.filter((a) => a?.result === "phishing")?.length || 0
        const legitimate = dayAnalyses.filter((a) => a?.result === "legitimate")?.length || 0
        const total = dayAnalyses.length

        trendData.push({
          date: dayStart.toISOString().split("T")[0],
          phishing,
          legitimate,
          total,
        })
      }

      return trendData
    } catch (error) {
      console.error("Error generating trend data:", error)
      return []
    }
  }

  // Get top threat indicators
  getTopThreatIndicators() {
    try {
      const indicatorCounts: { [key: string]: number } = {}

      this.analyses?.forEach((analysis) => {
        if (analysis?.indicators && Array.isArray(analysis.indicators)) {
          analysis.indicators.forEach((indicator) => {
            if (typeof indicator === "string" && indicator.trim()) {
              indicatorCounts[indicator] = (indicatorCounts[indicator] || 0) + 1
            }
          })
        }
      })

      return Object.entries(indicatorCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    } catch (error) {
      console.error("Error calculating threat indicators:", error)
      return []
    }
  }

  // Clear all data (for testing)
  clear() {
    this.analyses = []
    this.systemMetrics = []
    this.startTime = new Date()
  }
}

// Export singleton instance
export const analyticsStore = new AnalyticsStore()
// End of AnalyticsStore: In-memory analytics and system metrics store
