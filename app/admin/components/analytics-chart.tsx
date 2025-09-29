"use client"

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"

interface TrendData {
  date: string
  phishing: number
  legitimate: number
  total: number
}

interface AnalyticsChartProps {
  data: TrendData[]
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } catch (error) {
      return dateStr
    }
  }

  // Add safety checks for data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">No data available</div>
          <div className="text-sm">Start analyzing emails to see trends</div>
        </div>
      </div>
    )
  }

  const formattedData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
    phishing: item.phishing || 0,
    legitimate: item.legitimate || 0,
    total: item.total || 0,
  }))

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-medium">{label}</p>
                    <div className="space-y-1">
                      <p className="text-sm text-red-600">
                        Phishing: {payload.find((p) => p.dataKey === "phishing")?.value || 0}
                      </p>
                      <p className="text-sm text-green-600">
                        Legitimate: {payload.find((p) => p.dataKey === "legitimate")?.value || 0}
                      </p>
                      <p className="text-sm text-blue-600">
                        Total: {payload.find((p) => p.dataKey === "total")?.value || 0}
                      </p>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="phishing"
            stackId="1"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.6}
            name="Phishing"
          />
          <Area
            type="monotone"
            dataKey="legitimate"
            stackId="1"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.6}
            name="Legitimate"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            name="Total Analyses"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
