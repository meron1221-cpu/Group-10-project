import { NextResponse } from "next/server"
import { analyticsStore } from "@/lib/analytics-store"

export async function GET() {
  try {
    const stats = analyticsStore.getDashboardStats()
    const trendData = analyticsStore.getTrendData(30)
    const topIndicators = analyticsStore.getTopThreatIndicators()
    const recentAnalyses = analyticsStore.getAnalyses(50)

    // Ensure all data has proper structure
    const response = {
      stats: stats || {
        totalAnalyses: 0,
        phishingDetected: 0,
        legitimateEmails: 0,
        averageConfidence: 0,
        systemUptime: 99.8,
        responseTime: 0,
        activeUsers: 0,
        dailyAnalyses: 0,
      },
      trendData: Array.isArray(trendData) ? trendData : [],
      topIndicators: Array.isArray(topIndicators) ? topIndicators : [],
      recentAnalyses: Array.isArray(recentAnalyses) ? recentAnalyses : [],
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching admin stats:", error)

    // Return safe default values on error
    return NextResponse.json({
      stats: {
        totalAnalyses: 0,
        phishingDetected: 0,
        legitimateEmails: 0,
        averageConfidence: 0,
        systemUptime: 99.8,
        responseTime: 0,
        activeUsers: 0,
        dailyAnalyses: 0,
      },
      trendData: [],
      topIndicators: [],
      recentAnalyses: [],
    })
  }
}
