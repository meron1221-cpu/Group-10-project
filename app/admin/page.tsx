"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { motion } from "framer-motion";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";
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
  ShieldCheck,
  UserCheck,
  UserX,
  LucideProps,
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
  DropdownMenuSeparator,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Toaster } from "@/components/ui/sonner";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AnalyticsChart } from "./components/analytics-chart";

// --- INTERFACES ---
interface Report {
  id: number;
  name: string;
  date: string;
  by: string;
}

interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Analyst" | "User";
  lastActive: string;
  status: "Active" | "Suspended" | "Pending";
  isVerified: boolean;
  scamReports: number;
  trustScore: number; // 0-100
  riskLevel: "Low" | "Medium" | "High";
}

// --- REUSABLE & VIEW COMPONENTS (ORDER CORRECTED) ---

// --- LOGIN PAGE COMPONENT ---
function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (email === "admin@guardsphere.com" && password === "password") {
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
                placeholder="admin@guardsphere.com"
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
function Sidebar({
  activeView,
  setActiveView,
  onLogout,
}: {
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
}) {
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
          <span className="text-2xl font-bold text-white">GuardSphere</span>
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

// --- REUSABLE KPI CARD COMPONENT ---
function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType<LucideProps>;
  colorClass: string;
}) {
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

// --- PROFESSIONAL VIEW COMPONENTS ---

// --- ReportsView ---
function ReportsView() {
  const [date, setDate] = useState<DateRange | undefined>();
  const [reportType, setReportType] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<Report[]>([
    { id: 1, name: "Q4 2023 Threat Summary", date: "2024-01-05", by: "Admin" },
    { id: 2, name: "December User Activity", date: "2024-01-02", by: "Admin" },
    {
      id: 3,
      name: "Weekly Performance Metrics",
      date: "2023-12-28",
      by: "System",
    },
  ]);

  const handleGenerateReport = () => {
    if (!reportType || !date?.from) {
      toast.error("Please select a report type and a date range.");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now(),
        name: `${reportType} (${format(date.from!, "MMM d")} - ${
          date.to ? format(date.to, "MMM d") : ""
        })`,
        date: format(new Date(), "yyyy-MM-dd"),
        by: "Admin",
      };
      setGeneratedReports((prevReports) => [newReport, ...prevReports]);
      setIsGenerating(false);
      toast.success("New report has been generated successfully!");
      setDate(undefined);
      setReportType("");
    }, 1500);
  };

  const handleDownload = (report: Report) => {
    toast.info(`Generating PDF for: ${report.name}`);
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("GuardSphere Security Report", 14, 22);
    doc.setFontSize(12);
    doc.text(report.name, 14, 32);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${report.date} by ${report.by}`, 14, 38);

    autoTable(doc, {
      startY: 50,
      head: [["Threat Type", "Count", "Severity", "Recommendation"]],
      body: [
        ["Phishing", "1,204", "High", "Block associated domains"],
        ["Malware", "345", "High", "Isolate affected systems"],
        ["Suspicious Login", "5,678", "Medium", "Require user password reset"],
        ["Spam", "10,982", "Low", "Update spam filter rules"],
        ["Social Engineering", "88", "High", "User training required"],
      ],
      theme: "striped",
      headStyles: { fillColor: [22, 163, 74] },
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      "This is an auto-generated report. Do not reply.",
      14,
      finalY + 10
    );
    doc.save(`${report.name.replace(/ /g, "_")}.pdf`);
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
            <Select value={reportType} onValueChange={setReportType}>
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
                      onClick={() => handleDownload(report)}
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

// --- UserFormDialog ---
function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ManagedUser | null;
  onSave: (data: {
    name: string;
    email: string;
    role: ManagedUser["role"];
  }) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User" as ManagedUser["role"],
  });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, role: user.role });
    } else {
      setFormData({ name: "", email: "", role: "User" });
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill out all required fields.");
      return;
    }
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
          <DialogDescription>
            {user
              ? `Update the details for ${user.name}.`
              : "Enter the details for the new user."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value as ManagedUser["role"] })
              }
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Analyst">Analyst</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">
              {user ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- UserManagementView ---
function UserManagementView() {
  const [users, setUsers] = useState<ManagedUser[]>([
    {
      id: 1,
      name: "Aphran Mohammed",
      email: "aphran@guardsphere.com",
      role: "Admin",
      lastActive: "2 min ago",
      status: "Active",
      isVerified: true,
      scamReports: 12,
      trustScore: 98,
      riskLevel: "Low",
    },
    {
      id: 2,
      name: "Nahom Bekele",
      email: "nahom.b@example.com",
      role: "Analyst",
      lastActive: "1 hour ago",
      status: "Active",
      isVerified: true,
      scamReports: 45,
      trustScore: 92,
      riskLevel: "Low",
    },
    {
      id: 3,
      name: "Dawit Addis",
      email: "dawit.a@example.com",
      role: "User",
      lastActive: "3 days ago",
      status: "Active",
      isVerified: false,
      scamReports: 5,
      trustScore: 75,
      riskLevel: "Medium",
    },
    {
      id: 4,
      name: "Meron Nisrane",
      email: "meron.n@example.com",
      role: "User",
      lastActive: "2 weeks ago",
      status: "Suspended",
      isVerified: false,
      scamReports: 23,
      trustScore: 34,
      riskLevel: "High",
    },
    {
      id: 5,
      name: "Amanuel",
      email: "amanuel@example.com",
      role: "User",
      lastActive: "1 month ago",
      status: "Active",
      isVerified: false,
      scamReports: 2,
      trustScore: 65,
      riskLevel: "Medium",
    },
    {
      id: 6,
      name: "New User",
      email: "new.user@example.com",
      role: "User",
      lastActive: "Never",
      status: "Pending",
      isVerified: false,
      scamReports: 0,
      trustScore: 50,
      riskLevel: "Medium",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || user.status === statusFilter) &&
        (roleFilter === "all" || user.role === roleFilter)
    );
  }, [users, searchTerm, statusFilter, roleFilter]);

  const kpiData = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "Active").length,
      suspended: users.filter((u) => u.status === "Suspended").length,
      verified: users.filter((u) => u.isVerified).length,
    }),
    [users]
  );

  const roleDistribution = useMemo(() => {
    const counts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<ManagedUser["role"], number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [users]);

  const topReporters = useMemo(
    () => [...users].sort((a, b) => b.scamReports - a.scamReports).slice(0, 3),
    [users]
  );

  const handleOpenAddDialog = () => {
    setEditingUser(null);
    setIsUserDialogOpen(true);
  };

  const handleOpenEditDialog = (user: ManagedUser) => {
    setEditingUser(user);
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = (formData: {
    name: string;
    email: string;
    role: ManagedUser["role"];
  }) => {
    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
      toast.success(`User "${formData.name}" has been updated.`);
    } else {
      const newUser: ManagedUser = {
        id: Date.now(),
        ...formData,
        lastActive: "Just now",
        status: "Active",
        isVerified: false,
        scamReports: 0,
        trustScore: 50,
        riskLevel: "Medium",
      };
      setUsers([newUser, ...users]);
      toast.success(`New user "${formData.name}" has been created.`);
    }
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm("Are you sure you want to permanently delete this user?")) {
      const userName = users.find((u) => u.id === userId)?.name;
      setUsers(users.filter((u) => u.id !== userId));
      toast.error(`User "${userName}" has been deleted.`);
    }
  };

  const handleStatusChange = (
    userId: number,
    newStatus: ManagedUser["status"]
  ) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    toast.success(`User status updated to ${newStatus}.`);
  };

  const getRiskColor = (level: ManagedUser["riskLevel"]) => {
    if (level === "High") return "text-red-600";
    if (level === "Medium") return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusColor = (status: ManagedUser["status"]) => {
    if (status === "Active") return "bg-green-100 text-green-800";
    if (status === "Suspended") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <>
      <div className="flex-1 p-6 lg:p-8 space-y-8 animate-in fade-in-50 duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Total Users"
            value={kpiData.total.toString()}
            subtitle="All accounts"
            icon={Users}
            colorClass="border-blue-500"
          />
          <KpiCard
            title="Active Users"
            value={kpiData.active.toString()}
            subtitle="Currently active"
            icon={UserCheck}
            colorClass="border-green-500"
          />
          <KpiCard
            title="Suspended"
            value={kpiData.suspended.toString()}
            subtitle="Restricted accounts"
            icon={UserX}
            colorClass="border-red-500"
          />
          <KpiCard
            title="Verified Reporters"
            value={kpiData.verified.toString()}
            subtitle="Trusted contributors"
            icon={ShieldCheck}
            colorClass="border-sky-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Directory</CardTitle>
                  <CardDescription>
                    Manage, filter, and search all users in the system.
                  </CardDescription>
                </div>
                <Button onClick={handleOpenAddDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 py-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Analyst">Analyst</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Trust Score</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Reports</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.isVerified && (
                              <ShieldCheck className="h-4 w-4 text-sky-500" />
                            )}
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={user.trustScore}
                              className="h-2 w-20"
                            />
                            <span className="text-xs text-muted-foreground">
                              {user.trustScore}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${getRiskColor(
                              user.riskLevel
                            )}`}
                          >
                            {user.riskLevel}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColor(user.status)}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {user.scamReports}
                        </TableCell>
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
                                onClick={() => handleOpenEditDialog(user)}
                              >
                                Edit User
                              </DropdownMenuItem>
                              {user.status === "Active" && (
                                <DropdownMenuItem
                                  className="text-yellow-600"
                                  onClick={() =>
                                    handleStatusChange(user.id, "Suspended")
                                  }
                                >
                                  Suspend User
                                </DropdownMenuItem>
                              )}
                              {user.status === "Suspended" && (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() =>
                                    handleStatusChange(user.id, "Active")
                                  }
                                >
                                  Restore User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteUser(user.id)}
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
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Top Reporters</CardTitle>
                <CardDescription>
                  Users with the most valid reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {topReporters.map((user, index) => (
                    <li
                      key={user.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-muted-foreground">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.role}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{user.scamReports}</p>
                        <p className="text-xs text-muted-foreground">Reports</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Role Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {roleDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <UserFormDialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </>
  );
}

// --- ThreatMapView ---
const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/ethiopia/ethiopia-and-neighbors.json";

const locations = {
  "Addis Ababa": {
    coordinates: [38.7578, 9.0227] as [number, number],
    type: "City",
  },
  "Dire Dawa": { coordinates: [41.85, 9.6] as [number, number], type: "City" },
  Mekelle: { coordinates: [39.4667, 13.5] as [number, number], type: "City" },
  "Bahir Dar": {
    coordinates: [37.3833, 11.6] as [number, number],
    type: "City",
  },
  Hawassa: { coordinates: [38.4667, 7.05] as [number, number], type: "City" },
  Nairobi: {
    coordinates: [36.8219, -1.2921] as [number, number],
    type: "External",
  },
  Dubai: {
    coordinates: [55.2708, 25.2048] as [number, number],
    type: "External",
  },
  Guangzhou: {
    coordinates: [113.2644, 23.1291] as [number, number],
    type: "External",
  },
  "Washington DC": {
    coordinates: [-77.0369, 38.9072] as [number, number],
    type: "External",
  },
};

type Threat = {
  id: number;
  origin: keyof typeof locations;
  target: keyof typeof locations;
  type: "Email" | "SMS" | "Social Media" | "Fake Website";
  severity: "Low" | "Medium" | "High";
  timestamp: number; // hours ago
  targetInstitution?: string;
};

const allThreats: Threat[] = [
  {
    id: 1,
    origin: "Dubai",
    target: "Addis Ababa",
    type: "Fake Website",
    severity: "High",
    timestamp: 1,
    targetInstitution: "Bank of Abyssinia",
  },
  {
    id: 2,
    origin: "Guangzhou",
    target: "Addis Ababa",
    type: "Email",
    severity: "High",
    timestamp: 2,
    targetInstitution: "Ethio Telecom",
  },
  {
    id: 3,
    origin: "Addis Ababa",
    target: "Nairobi",
    type: "SMS",
    severity: "Medium",
    timestamp: 3,
  },
  {
    id: 4,
    origin: "Washington DC",
    target: "Mekelle",
    type: "Social Media",
    severity: "Low",
    timestamp: 5,
  },
  {
    id: 5,
    origin: "Bahir Dar",
    target: "Hawassa",
    type: "Email",
    severity: "Medium",
    timestamp: 8,
  },
  {
    id: 6,
    origin: "Dubai",
    target: "Dire Dawa",
    type: "Fake Website",
    severity: "High",
    timestamp: 10,
    targetInstitution: "CBE",
  },
  {
    id: 7,
    origin: "Guangzhou",
    target: "Bahir Dar",
    type: "SMS",
    severity: "Medium",
    timestamp: 12,
  },
];

function ThreatMapView() {
  const [threatTypeFilter, setThreatTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState([24]);

  const filteredThreats = useMemo(() => {
    return allThreats.filter(
      (threat) =>
        (threatTypeFilter === "all" || threat.type === threatTypeFilter) &&
        (severityFilter === "all" || threat.severity === severityFilter) &&
        threat.timestamp <= timeFilter[0]
    );
  }, [threatTypeFilter, severityFilter, timeFilter]);

  const getSeverityColor = (severity: Threat["severity"]) => {
    if (severity === "High") return "#ef4444"; // red-500
    if (severity === "Medium") return "#f97316"; // orange-500
    return "#eab308"; // yellow-500
  };

  const topOrigins = useMemo(() => {
    const counts = filteredThreats.reduce((acc, t) => {
      acc[t.origin] = (acc[t.origin] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [filteredThreats]);

  const topTargets = useMemo(() => {
    const institutions = filteredThreats
      .map((t) => t.targetInstitution)
      .filter((t): t is string => !!t);
    const counts = institutions.reduce((acc, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [filteredThreats]);

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in-50 duration-500 h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
      {/* Main Map Content */}
      <div className="lg:col-span-3 bg-slate-800/90 dark:bg-slate-900/90 border border-slate-700/50 rounded-lg overflow-hidden relative flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="text-white font-semibold">
            Regional Threat Activity: Ethiopia
          </h3>
        </div>
        <div className="flex-1 relative bg-grid-slate-700/[0.05]">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900" />
          <div className="animate-scanline"></div>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: [40, 9], // Center on Ethiopia
              scale: 2200,
            }}
            className="w-full h-full"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isEthiopia = geo.properties.NAME_EN === "Ethiopia";
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isEthiopia ? "#1e293b" : "#0f172a"} // Darker fill for Ethiopia
                      stroke="#334155" // slate-700
                      strokeWidth={0.5}
                    />
                  );
                })
              }
            </Geographies>
            {filteredThreats.map((threat) => (
              <Line
                key={`line-${threat.id}`}
                from={locations[threat.origin].coordinates}
                to={locations[threat.target].coordinates}
                stroke={getSeverityColor(threat.severity)}
                strokeWidth={2}
                strokeLinecap="round"
                className="animate-comet"
                style={{
                  filter: `drop-shadow(0 0 3px ${getSeverityColor(
                    threat.severity
                  )})`,
                  animationDelay: `${threat.id * 0.2}s`,
                }}
              />
            ))}
            {Object.entries(locations).map(([name, { coordinates, type }]) => (
              <Marker key={name} coordinates={coordinates}>
                <motion.circle
                  r={type === "City" ? 4 : 6}
                  fill={type === "City" ? "#38bdf8" : "#fde047"} // sky-400 for cities, yellow-400 for external
                  stroke="#fff"
                  strokeWidth={1}
                  className="animate-pulse-strong"
                  style={{
                    filter: `drop-shadow(0 0 8px ${
                      type === "City" ? "#38bdf8" : "#fde047"
                    })`,
                  }}
                />
                <text
                  textAnchor="middle"
                  y={-10}
                  className="text-xs fill-slate-300 font-sans"
                >
                  {name}
                </text>
              </Marker>
            ))}
          </ComposableMap>
        </div>
        <div className="p-2 border-t border-slate-700/50 bg-black/20 text-white text-sm overflow-hidden h-10 flex items-center">
          <span className="font-bold text-red-500 mr-4 flex-shrink-0 px-2">
            LIVE FEED:
          </span>
          <div className="animate-ticker whitespace-nowrap">
            {allThreats.map((t) => (
              <span key={t.id} className="mr-12">
                <span
                  style={{ color: getSeverityColor(t.severity) }}
                  className="font-semibold"
                >
                  [{t.severity.toUpperCase()}]
                </span>{" "}
                {t.type} attack from {t.origin} targeting {t.target}
                {t.targetInstitution && ` (${t.targetInstitution})`}.
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {allThreats.map((t) => (
              <span key={`dup-${t.id}`} className="mr-12">
                <span
                  style={{ color: getSeverityColor(t.severity) }}
                  className="font-semibold"
                >
                  [{t.severity.toUpperCase()}]
                </span>{" "}
                {t.type} attack from {t.origin} targeting {t.target}
                {t.targetInstitution && ` (${t.targetInstitution})`}.
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar with Filters and Stats */}
      <div className="lg:col-span-1 space-y-6 flex flex-col">
        <Card>
          <CardHeader>
            <CardTitle>Threat Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Threat Type</Label>
              <Select
                value={threatTypeFilter}
                onValueChange={setThreatTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Fake Website">Fake Website</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Severity</Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Time Range (Last {timeFilter[0]} hours)</Label>
              <Slider
                defaultValue={[24]}
                max={24}
                step={1}
                min={1}
                onValueChange={setTimeFilter}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Local Intelligence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Threats in Range</span>
              <span className="font-bold">{filteredThreats.length}</span>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Top Origins</h4>
              <ul className="space-y-1">
                {topOrigins.map(([country, count]) => (
                  <li key={country} className="flex justify-between">
                    <span>{country}</span>
                    <span className="font-mono">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Top Targeted Institutions</h4>
              <ul className="space-y-1">
                {topTargets.map(([name, count]) => (
                  <li key={name} className="flex justify-between">
                    <span>{name}</span>
                    <span className="font-mono">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- NEW: Comprehensive SettingsView ---
function SettingsView() {
  // State for all settings
  const [settings, setSettings] = useState({
    // Profile
    name: "Aphran Mohammed",
    email: "aphran@guardsphere.com",
    // Security
    twoFactor: true,
    passwordPolicy: "medium",
    // Notifications
    emailOnCritical: true,
    smsOnCritical: false,
    weeklySummary: true,
    alertSeverity: "High",
    // System
    theme: "dark",
    language: "en",
    refreshInterval: "30s",
  });

  // Mock data for active sessions
  const activeSessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      ip: "192.168.1.10",
      lastSeen: "2 minutes ago",
      isCurrent: true,
    },
    {
      id: 2,
      device: "Safari on iPhone",
      ip: "103.22.5.12",
      lastSeen: "3 hours ago",
      isCurrent: false,
    },
  ];

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast.success("Setting updated!");
  };

  return (
    <div className="flex-1 p-6 lg:p-8 animate-in fade-in-50 duration-500">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your personal details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) =>
                        setSettings({ ...settings, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    onClick={() => toast.success("Profile information saved!")}
                  >
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    It's a good idea to use a strong password that you're not
                    using elsewhere.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <Button
                    onClick={() =>
                      toast.success("Password changed successfully!")
                    }
                  >
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure 2FA, password policies, and manage active sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account.
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
                    <SelectItem value="low">Low (8+ characters)</SelectItem>
                    <SelectItem value="medium">
                      Medium (12+ characters, 1 number)
                    </SelectItem>
                    <SelectItem value="high">
                      High (16+ characters, 1 number, 1 symbol)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                This is a list of devices that have logged into your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {session.device}{" "}
                        {session.isCurrent && (
                          <Badge variant="outline" className="ml-2">
                            This device
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{session.ip}</TableCell>
                      <TableCell>{session.lastSeen}</TableCell>
                      <TableCell className="text-right">
                        {!session.isCurrent && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              toast.error(
                                `Session from ${session.device} has been logged out.`
                              )
                            }
                          >
                            Log Out
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive alerts and reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">Email on Critical Threat</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive an email for high-risk detections.
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
                  <h4 className="font-medium">SMS on Critical Threat</h4>
                  <p className="text-sm text-muted-foreground">
                    Get an SMS for immediate, high-severity alerts.
                  </p>
                </div>
                <Switch
                  checked={settings.smsOnCritical}
                  onCheckedChange={(checked) =>
                    handleSettingChange("smsOnCritical", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">Weekly Summary Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Get a weekly digest of all threat activity.
                  </p>
                </div>
                <Switch
                  checked={settings.weeklySummary}
                  onCheckedChange={(checked) =>
                    handleSettingChange("weeklySummary", checked)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Severity for Alerts</Label>
                <Select
                  value={settings.alertSeverity}
                  onValueChange={(value) =>
                    handleSettingChange("alertSeverity", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">All Alerts (Low+)</SelectItem>
                    <SelectItem value="Medium">Medium & High Alerts</SelectItem>
                    <SelectItem value="High">
                      Only High-Severity Alerts
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System & App Preferences</CardTitle>
              <CardDescription>
                Customize the application's appearance and behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">Theme</h4>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark mode.
                  </p>
                </div>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => handleSettingChange("theme", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">Language</h4>
                  <p className="text-sm text-muted-foreground">
                    Set your preferred language for the UI.
                  </p>
                </div>
                <Select
                  value={settings.language}
                  onValueChange={(value) =>
                    handleSettingChange("language", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="am">Amharic (አማርኛ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">Dashboard Auto-Refresh</h4>
                  <p className="text-sm text-muted-foreground">
                    Set how often live data should refresh.
                  </p>
                </div>
                <Select
                  value={settings.refreshInterval}
                  onValueChange={(value) =>
                    handleSettingChange("refreshInterval", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15s">Every 15 seconds</SelectItem>
                    <SelectItem value="30s">Every 30 seconds</SelectItem>
                    <SelectItem value="60s">Every 1 minute</SelectItem>
                    <SelectItem value="none">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- DashboardView ---
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((item) => (
          <KpiCard key={item.title} {...item} />
        ))}
      </div>
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

// --- DIALOG COMPONENTS ---
function ScanUrlDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{
    isMalicious: boolean;
    message: string;
  } | null>(null);

  const handleScan = async () => {
    if (!url) return;
    setIsScanning(true);
    setResult(null);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const knownMaliciousDomains = [
      "evil-domain.com",
      "malicious-site.net",
      "phishing-central.org",
    ];
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

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setUrl("");
        setIsScanning(false);
        setResult(null);
      }, 200);
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

function ReportScamDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!source || !description) {
      toast.error("Please fill out all fields to submit a report.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success("Scam report submitted successfully!", {
      description: "Thank you for helping keep the community safe.",
    });
    onOpenChange(false);
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
function DashboardContent({ onLogout }: { onLogout: () => void }) {
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
