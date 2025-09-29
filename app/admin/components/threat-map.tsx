"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

export function ThreatMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const threatData = [
    { region: "North America", threats: 4521, percentage: 35.2, color: "#ef4444" },
    { region: "Europe", threats: 3847, percentage: 29.9, color: "#f97316" },
    { region: "Asia Pacific", threats: 2934, percentage: 22.8, color: "#eab308" },
    { region: "South America", threats: 892, percentage: 6.9, color: "#22c55e" },
    { region: "Africa", threats: 567, percentage: 4.4, color: "#3b82f6" },
    { region: "Oceania", threats: 103, percentage: 0.8, color: "#8b5cf6" },
  ]

  return (
    <div className="space-y-4">
      {/* Simplified World Map Visualization */}
      <div className="bg-gray-100 rounded-lg p-6 h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <p className="text-gray-600">Interactive threat map visualization</p>
          <p className="text-sm text-gray-500">Click regions below for details</p>
        </div>
      </div>

      {/* Regional Threat Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {threatData.map((region, index) => (
          <Card
            key={index}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedRegion === region.region ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedRegion(region.region)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{region.region}</h4>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: region.color }} />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">{region.threats.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{region.percentage}% of total threats</div>
            </div>
          </Card>
        ))}
      </div>

      {selectedRegion && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-medium mb-2">📍 {selectedRegion} Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Top Attack Vector:</span>
              <div className="font-medium">Malicious Links</div>
            </div>
            <div>
              <span className="text-gray-600">Peak Activity:</span>
              <div className="font-medium">9-11 AM Local</div>
            </div>
            <div>
              <span className="text-gray-600">Most Targeted:</span>
              <div className="font-medium">Financial Sector</div>
            </div>
            <div>
              <span className="text-gray-600">Trend:</span>
              <div className="font-medium text-red-600">↑ 12% this week</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
