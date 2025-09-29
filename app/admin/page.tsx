"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { motion } from "framer-motion";
import { toast } from "sonner"; // Import the toast function
import {
  Shield,
  TrendingUp,
  Users,
  Mail,
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
  Download,
  LayoutDashboard,
  Settings,
  BarChart3,
  LogOut,
  Globe,
  Wrench,
  FileText,
  Search,
  PlusCircle,
  MoreHorizontal,
  KeyRound,
  Calendar as CalendarIcon,
  Target,
  ShieldAlert,
  ScanLine,
  Flag,
  Server,
  Database,
  Cpu,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Toaster } from "@/components/ui/sonner"; // Import the Toaster component
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AnalyticsChart } from "./components/analytics-chart";

// --- INTERFACES (Unchanged) ---
interface DashboardStats {
  totalAnalyses: number;
  phishingDetected: number;
  legitimateEmails: number;
  averageConfidence: number;
  systemUptime: number;
  responseTime: number;
  activeUsers: number;
  dailyAnalyses: number;
}
interface TrendData {
  date: string;
  phishing: number;
  legitimate: number;
  total: number;
}
interface ThreatIndicator {
  name: string;
  count: number;
}
interface Analysis {
  id: string;
  timestamp: string;
  result: "phishing" | "legitimate" | "suspicious";
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  indicators: string[];
  userAgent: string;
  ipAddress: string;
}

// --- NEW LOGIN PAGE COMPONENT ---
function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (email === "admin@phishguard.com" && password === "password") {
        onLoginSuccess();
      } else {
        setError("Invalid email or password.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans p-4">
      <Card className="w-full max-w-sm shadow-2xl animate-in fade-in-50 duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Admin Portal</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@phishguard.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// --- SIDEBAR COMPONENT ---
function Sidebar({ activeView, setActiveView, onLogout }) {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: BarChart3, label: "Reports" },
    { icon: Users, label: "User Management" },
    { icon: Globe, label: "Threat Map" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-900 text-gray-300 flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-800">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-400" />
          <span className="text-2xl font-bold text-white">PhishGuard</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveView(item.label)}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-800 hover:text-white transition-colors data-[active=true]:bg-blue-600 data-[active=true]:text-white"
            data-active={activeView === item.label}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Log Out
        </button>
      </div>
    </aside>
  );
}

// --- PROFESSIONAL VIEW COMPONENTS ---

function ReportsView() {
  const [date, setDate] = useState<DateRange | undefined>();
  const [reportType, setReportType] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generatedReports = [
    { id: 1, name: "Q4 2023 Threat Summary", date: "2024-01-05", by: "Admin" },
    { id: 2, name: "December User Activity", date: "2024-01-02", by: "Admin" },
    {
      id: 3,
      name: "Weekly Performance Metrics",
      date: "2023-12-28",
      by: "System",
    },
  ];

  const handleGenerateReport = () => {
    if (!reportType || !date) {
      toast.error("Please select a report type and a date range.");
      return;
    }
    setIsGenerating(true);
    console.log("Generating report...", { reportType, date });
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(
        `Report "${reportType}" for the selected date range has been generated!`
      );
    }, 1500);
  };

  const handleDownload = (reportName: string) => {
    console.log(`Downloading report: ${reportName}`);
    toast.info(`Downloading: ${reportName}`);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 animate-in fade-in-50 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>
            Select the report type and date range to generate a new report.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select a report" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Threat Summary">Threat Summary</SelectItem>
                <SelectItem value="User Activity">User Activity</SelectItem>
                <SelectItem value="System Performance">
                  System Performance
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-range">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full md:w-auto"
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? "Generating..." : "Generate Report"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Date Generated</TableHead>
                <TableHead>Generated By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generatedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.by}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(report.name)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function UserManagementView() {
  const initialUsers = useMemo(
    () => [
      {
        id: 1,
        name: "Admin User",
        email: "admin@phishguard.com",
        role: "Admin",
        lastActive: "2 min ago",
        status: "Active",
      },
      {
        id: 2,
        name: "John Doe",
        email: "john.d@example.com",
        role: "Analyst",
        lastActive: "1 hour ago",
        status: "Active",
      },
      {
        id: 3,
        name: "Jane Smith",
        email: "jane.s@example.com",
        role: "Viewer",
        lastActive: "3 days ago",
        status: "Inactive",
      },
    ],
    []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const filteredUsers = initialUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 animate-in fade-in-50 duration-500">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage access and roles for all users.
            </CardDescription>
          </div>
          <Button
            onClick={() => toast.info("Opening form to add a new user...")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "Active" ? "default" : "outline"}
                      className={
                        user.status === "Active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : ""
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            toast.info(`Editing user: ${user.name}`)
                          }
                        >
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            toast.warning(
                              `Resetting password for: ${user.name}`
                            )
                          }
                        >
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete ${user.name}?`
                              )
                            ) {
                              toast.error(`${user.name} has been deleted.`);
                            }
                          }}
                        >
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ThreatMapView() {
  return (
    <div className="flex-1 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in-50 duration-500">
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Global Threat Map</CardTitle>
            <CardDescription>
              Live visualization of phishing attempts by origin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[60vh] bg-slate-200 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                Interactive Threat Map Component Would Be Here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Threats (24h)</span>
              <span className="font-bold">1,204</span>
            </div>
            <div className="flex justify-between">
              <span>High-Risk Countries</span>
              <span className="font-bold">3</span>
            </div>
            <div className="flex justify-between">
              <span>Targeted IPs</span>
              <span className="font-bold">48</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Live Threat Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <span className="text-red-500 mr-2 animate-pulse">●</span>
              <div>
                <p className="text-sm font-medium">
                  High-Risk Phishing Attempt
                </p>
                <p className="text-xs text-muted-foreground">From: Russia</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-2 animate-pulse [animation-delay:0.5s]">
                ●
              </span>
              <div>
                <p className="text-sm font-medium">Suspicious Link Detected</p>
                <p className="text-xs text-muted-foreground">From: Nigeria</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsView() {
  const [settings, setSettings] = useState({
    siteName: "PhishGuard",
    adminEmail: "admin@phishguard.com",
    twoFactor: false,
    passwordPolicy: "medium",
    emailOnCritical: true,
    weeklySummary: false,
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex-1 p-6 lg:p-8 animate-in fade-in-50 duration-500">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage basic application settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={settings.siteName}
                  onChange={(e) =>
                    handleSettingChange("siteName", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Contact Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) =>
                    handleSettingChange("adminEmail", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security policies and authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Require all users to set up 2FA.
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactor}
                  onCheckedChange={(checked) =>
                    handleSettingChange("twoFactor", checked)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Password Policy</Label>
                <Select
                  value={settings.passwordPolicy}
                  onValueChange={(value) =>
                    handleSettingChange("passwordPolicy", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (8 characters)</SelectItem>
                    <SelectItem value="medium">
                      Medium (12 characters, 1 number)
                    </SelectItem>
                    <SelectItem value="high">
                      High (16 characters, 1 number, 1 symbol)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage when and how you receive alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">Email on Critical Threat</h4>
                  <p className="text-sm text-muted-foreground">
                    Send an email for high-risk detections.
                  </p>
                </div>
                <Switch
                  checked={settings.emailOnCritical}
                  onCheckedChange={(checked) =>
                    handleSettingChange("emailOnCritical", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">Weekly Summary Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate and email a weekly report.
                  </p>
                </div>
                <Switch
                  checked={settings.weeklySummary}
                  onCheckedChange={(checked) =>
                    handleSettingChange("weeklySummary", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage API keys for programmatic access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Current API Key</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="api-key"
                    readOnly
                    defaultValue="ph_live_******************"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "ph_live_******************"
                      );
                      toast.success("API Key copied to clipboard!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => toast.warning("Generating a new API key...")}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Generate New Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- NEW, REUSABLE KPI CARD COMPONENT ---
function KpiCard({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
      whileTap={{ scale: 0.95 }}
      className="h-full"
    >
      <Card
        className={`h-full overflow-hidden border-l-4 bg-white transition-all duration-300 hover:shadow-lg ${colorClass}`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- NEW, ENHANCED DASHBOARD VIEW ---
function DashboardView() {
  const kpiData = [
    {
      title: "Total Scams Detected",
      value: "18,432",
      subtitle: "+201 in last 24h",
      icon: ShieldAlert,
      colorClass: "border-red-500",
    },
    {
      title: "Detection Rate",
      value: "99.7%",
      subtitle: "Industry-leading accuracy",
      icon: Target,
      colorClass: "border-blue-500",
    },
    {
      title: "Active Threats",
      value: "14",
      subtitle: "Under investigation",
      icon: Activity,
      colorClass: "border-yellow-500",
    },
    {
      title: "User Reports",
      value: "256",
      subtitle: "+12 today",
      icon: Flag,
      colorClass: "border-green-500",
    },
  ];

  const trendData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const phishing = Math.floor(Math.random() * 300) + 100;
        const legitimate = Math.floor(Math.random() * 2000) + 1500;
        return {
          date: d.toISOString().split("T")[0],
          phishing,
          legitimate,
          total: phishing + legitimate,
        };
      }),
    []
  );

  const topScamCategories = [
    { name: "Phishing", value: 65, color: "bg-red-500" },
    { name: "Investment Fraud", value: 15, color: "bg-yellow-500" },
    { name: "Fake Job Ads", value: 10, color: "bg-blue-500" },
    { name: "Lottery Scams", value: 5, color: "bg-purple-500" },
    { name: "Other", value: 5, color: "bg-gray-400" },
  ];

  const liveThreatFeed = [
    {
      id: 1,
      severity: "High",
      description: "Credential theft attempt from evil-domain.com",
      time: "1m ago",
    },
    {
      id: 2,
      severity: "Medium",
      description: "Suspicious link detected in SMS",
      time: "3m ago",
    },
    {
      id: 3,
      severity: "High",
      description: "Bank impersonation scam detected",
      time: "5m ago",
    },
  ];

  const systemStatus = [
    { name: "Detection Engine", status: "Operational", icon: Cpu },
    { name: "API Service", status: "Operational", icon: Server },
    { name: "Database", status: "Operational", icon: Database },
  ];

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto animate-in fade-in-50 duration-500">
      {/* KPIs / Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((item) => (
          <KpiCard key={item.title} {...item} />
        ))}
      </div>

      {/* Graphs and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Scam Attempts Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <AnalyticsChart data={trendData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Scam Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topScamCategories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {category.value}%
                  </span>
                </div>
                <Progress
                  value={category.value}
                  className="h-2"
                  indicatorClassName={category.color}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Live Intelligence and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Threat Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Severity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveThreatFeed.map((threat) => (
                  <TableRow key={threat.id}>
                    <TableCell>
                      <Badge
                        variant={
                          threat.severity === "High"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {threat.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {threat.description}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {threat.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemStatus.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <service.icon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-muted-foreground">
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Scam of the Day</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold">
                "Netflix Subscription Expired" Phishing
              </h4>
              <p className="text-sm text-muted-foreground mt-2">
                A widespread email campaign is tricking users into entering
                payment details on a fake Netflix login page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- NEW DIALOG COMPONENTS ---

function ScanUrlDialog({ open, onOpenChange }) {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    if (!url) return;
    setIsScanning(true);
    setResult(null);
    console.log(`Scanning URL: ${url}`);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // --- UPDATED: Deterministic Mock Logic ---
    const knownMaliciousDomains = [
      "evil-domain.com",
      "malicious-site.net",
      "phishing-central.org",
    ];

    // Check if the input URL contains any of the known malicious domains.
    const isMalicious = knownMaliciousDomains.some((domain) =>
      url.includes(domain)
    );

    setResult({
      isMalicious,
      message: isMalicious
        ? "This URL is flagged as malicious by our database."
        : "This URL appears to be safe.",
    });

    setIsScanning(false);
  };

  // Reset state when dialog is closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setUrl("");
        setIsScanning(false);
        setResult(null);
      }, 200); // Delay to allow for closing animation
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan URL</DialogTitle>
          <DialogDescription>
            Enter a URL to check for threats. Try a known malicious domain like
            "evil-domain.com" to see a positive detection.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com"
            />
          </div>
          {result && (
            <div
              className={`p-3 rounded-md text-sm ${
                result.isMalicious
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {result.message}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleScan} disabled={isScanning || !url}>
            {isScanning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Scanning...
              </>
            ) : (
              <>
                <ScanLine className="h-4 w-4 mr-2" />
                Scan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReportScamDialog({ open, onOpenChange }) {
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!source || !description) {
      toast.error("Please fill out all fields to submit a report.");
      return;
    }
    setIsSubmitting(true);
    console.log("Submitting scam report:", { source, description });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    // --- UPDATED: Use toast notification instead of alert ---
    toast.success("Scam report submitted successfully!", {
      description: "Thank you for helping keep the community safe.",
    });

    onOpenChange(false); // Close dialog on success
  };

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSource("");
        setDescription("");
        setIsSubmitting(false);
      }, 200);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report a Scam</DialogTitle>
          <DialogDescription>
            Help the community by reporting a suspicious URL, email, or message.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="source">Scam Source (URL, Email, etc.)</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., suspicious-link.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the scam, including any suspicious details."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !source || !description}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Flag className="h-4 w-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN DASHBOARD WRAPPER ---
function DashboardContent({ onLogout }) {
  const [activeView, setActiveView] = useState("Dashboard");
  const [isScanUrlOpen, setIsScanUrlOpen] = useState(false);
  const [isReportScamOpen, setIsReportScamOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={onLogout}
      />
      <main className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-30">
          <div className="px-6 h-16 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {activeView}
            </h1>
            {activeView === "Dashboard" && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsScanUrlOpen(true)}
                >
                  <ScanLine className="h-4 w-4 mr-2" />
                  Scan URL
                </Button>
                <Button size="sm" onClick={() => setIsReportScamOpen(true)}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report Scam
                </Button>
              </div>
            )}
          </div>
        </header>

        {activeView === "Dashboard" ? (
          <DashboardView />
        ) : activeView === "Reports" ? (
          <ReportsView />
        ) : activeView === "User Management" ? (
          <UserManagementView />
        ) : activeView === "Threat Map" ? (
          <ThreatMapView />
        ) : activeView === "Settings" ? (
          <SettingsView />
        ) : null}
      </main>
      {/* Add the Toaster component here to render notifications */}
      <Toaster richColors position="top-right" />
      <ScanUrlDialog open={isScanUrlOpen} onOpenChange={setIsScanUrlOpen} />
      <ReportScamDialog
        open={isReportScamOpen}
        onOpenChange={setIsReportScamOpen}
      />
    </div>
  );
}

// --- MAIN PAGE COMPONENT WITH AUTHENTICATION ---
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  return <DashboardContent onLogout={handleLogout} />;
}
