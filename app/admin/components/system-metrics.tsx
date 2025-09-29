"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Server, Database, Cpu, HardDrive, Wifi, Zap } from "lucide-react"

export function SystemMetrics() {
  const systemData = {
    servers: [
      { name: "API Server 1", status: "healthy", cpu: 45, memory: 62, uptime: "99.9%" },
      { name: "API Server 2", status: "healthy", cpu: 38, memory: 55, uptime: "99.8%" },
      { name: "ML Processing", status: "warning", cpu: 78, memory: 84, uptime: "99.5%" },
      { name: "Database Primary", status: "healthy", cpu: 23, memory: 41, uptime: "100%" },
    ],
    database: {
      connections: 847,
      maxConnections: 1000,
      queryTime: 12.5,
      storage: 68.4,
    },
    api: {
      requestsPerMinute: 1247,
      errorRate: 0.02,
      averageLatency: 145,
    },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Server Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>Server Status</span>
          </CardTitle>
          <CardDescription>Real-time server performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemData.servers.map((server, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{server.name}</h4>
                  <Badge className={getStatusColor(server.status)}>{server.status}</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>{server.cpu}%</span>
                    </div>
                    <Progress value={server.cpu} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory</span>
                      <span>{server.memory}%</span>
                    </div>
                    <Progress value={server.memory} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span className="font-medium">{server.uptime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Active Connections</span>
                <span>
                  {systemData.database.connections}/{systemData.database.maxConnections}
                </span>
              </div>
              <Progress
                value={(systemData.database.connections / systemData.database.maxConnections) * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Storage Usage</span>
                <span>{systemData.database.storage}%</span>
              </div>
              <Progress value={systemData.database.storage} className="h-2" />
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg Query Time</span>
              <span className="font-medium">{systemData.database.queryTime}ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5" />
              <span>API Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">Requests/min</span>
              <span className="font-medium">{systemData.api.requestsPerMinute.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Error Rate</span>
              <span className="font-medium text-green-600">{systemData.api.errorRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg Latency</span>
              <span className="font-medium">{systemData.api.averageLatency}ms</span>
            </div>
            <div>
              <div className="text-sm mb-2">Response Time Distribution</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{"<100ms"}</span>
                  <span>67%</span>
                </div>
                <Progress value={67} className="h-1" />
                <div className="flex justify-between text-xs">
                  <span>100-500ms</span>
                  <span>28%</span>
                </div>
                <Progress value={28} className="h-1" />
                <div className="flex justify-between text-xs">
                  <span>{">500ms"}</span>
                  <span>5%</span>
                </div>
                <Progress value={5} className="h-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Resource Usage</span>
          </CardTitle>
          <CardDescription>System resource consumption over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Cpu className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">52%</div>
              <div className="text-sm text-gray-600">CPU Usage</div>
              <Progress value={52} className="mt-2" />
            </div>
            <div className="text-center">
              <HardDrive className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">68%</div>
              <div className="text-sm text-gray-600">Memory Usage</div>
              <Progress value={68} className="mt-2" />
            </div>
            <div className="text-center">
              <Database className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">34%</div>
              <div className="text-sm text-gray-600">Disk Usage</div>
              <Progress value={34} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
