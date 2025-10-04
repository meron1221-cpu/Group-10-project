"use client";

import { useState, useMemo, createContext, useContext, ReactNode } from "react";
import { Orbitron } from "next/font/google";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  Trash2,
  Edit,
  Download,
  FileText,
  PlusCircle,
  Search,
  MoreHorizontal,
  BarChart,
  Bell,
  User,
  FileDown,
  Map,
  Settings,
  X,
  Save,
  Flag,
  ShieldQuestion,
  TrendingUp,
  Trophy,
  LogOut,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// --- FONT SETUP ---
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// --- TYPES & MOCK DATA ---
interface UserReport {
  id: string;
  userId: string;
  type: string;
  date: string;
  status: "Verified Scam" | "Under Review" | "Pending";
  details: string;
  riskScore: number; // 0-100
  severity: "Low" | "Medium" | "High";
}

const allReports: UserReport[] = [
  {
    id: "rep-001",
    userId: "user-123",
    type: "Phishing",
    date: "2024-05-21",
    status: "Verified Scam",
    details: "Email from 'Netflx' asking to update payment.",
    riskScore: 95,
    severity: "High",
  },
  {
    id: "rep-002",
    userId: "user-123",
    type: "Fake Job Offer",
    date: "2024-05-19",
    status: "Under Review",
    details: "WhatsApp message for a high-paying remote job.",
    riskScore: 70,
    severity: "Medium",
  },
  {
    id: "rep-003",
    userId: "user-123",
    type: "Bank Impersonation",
    date: "2024-05-15",
    status: "Pending",
    details: "SMS claiming my bank account was locked.",
    riskScore: 85,
    severity: "High",
  },
  {
    id: "rep-004",
    userId: "user-456", // Different user
    type: "Lottery Scam",
    date: "2024-05-20",
    status: "Verified Scam",
    details: "You've won a prize! Click here to claim.",
    riskScore: 90,
    severity: "High",
  },
  {
    id: "rep-005",
    userId: "user-123",
    type: "Phishing",
    date: "2024-05-12",
    status: "Verified Scam",
    details: "Your Amazon account has been suspended.",
    riskScore: 92,
    severity: "High",
  },
];

const mockUser = {
  id: "user-123",
  name: "Alex Ryder",
  email: "alex.ryder@example.com",
  guardianScore: 1250,
  leaderboardRank: 142,
};

// --- HELPER COMPONENTS & FUNCTIONS ---

function KpiCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="shadow-md dark:bg-gray-800/50 transition-transform hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

const getStatusBadge = (status: UserReport["status"]) => {
  switch (status) {
    case "Verified Scam":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> {status}
        </Badge>
      );
    case "Under Review":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {status}
        </Badge>
      );
    case "Pending":
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {status}
        </Badge>
      );
  }
};

const getRiskBadge = (score: number) => {
  if (score > 80)
    return (
      <Badge variant="destructive" className="bg-red-500/20 text-red-500">
        High
      </Badge>
    );
  if (score > 50)
    return (
      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
        Medium
      </Badge>
    );
  return (
    <Badge variant="outline" className="bg-green-500/20 text-green-500">
      Low
    </Badge>
  );
};

function ReportEditDialog({
  report,
  onSave,
  children,
}: {
  report: UserReport;
  onSave: (updatedReport: UserReport) => void;
  children: ReactNode;
}) {
  const [details, setDetails] = useState(report.details);
  const [type, setType] = useState(report.type);

  const handleSave = () => {
    onSave({ ...report, details, type });
    toast.success("Report updated successfully!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Report</DialogTitle>
          <DialogDescription>
            Update the details for your report.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Phishing">Phishing</SelectItem>
                <SelectItem value="Fake Job Offer">Fake Job Offer</SelectItem>
                <SelectItem value="Bank Impersonation">
                  Bank Impersonation
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- NEW SIDEBAR COMPONENT ---
function Sidebar({
  activeView,
  setActiveView,
}: {
  activeView: string;
  setActiveView: (view: string) => void;
}) {
  const navItems = [
    { id: "vault", label: "Evidence Vault", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-gray-300 flex flex-col p-4">
      <div className="text-center py-4 border-b border-gray-700">
        <Link href="/" className="flex items-center justify-center space-x-2">
          <ShieldCheck className="h-8 w-8 text-blue-400" />
          <span className="text-2xl font-bold text-white">GuardSphere</span>
        </Link>
      </div>
      <nav className="flex-1 mt-6 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveView(item.id)}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="mt-auto space-y-2">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start">
            <Home className="mr-3 h-5 w-5" />
            Back to Main Site
          </Button>
        </Link>
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

// --- MAIN DASHBOARD COMPONENT ---
export default function DashboardPage() {
  const currentUser = mockUser;
  const [activeView, setActiveView] = useState("vault");
  const [allUserReports, setAllUserReports] = useState<UserReport[]>(
    allReports.filter((r) => r.userId === currentUser.id)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReports = useMemo(() => {
    return allUserReports.filter(
      (report) =>
        (report.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || report.status === statusFilter)
    );
  }, [allUserReports, searchTerm, statusFilter]);

  const kpiData = useMemo(() => {
    const total = allUserReports.length;
    const verified = allUserReports.filter(
      (r) => r.status === "Verified Scam"
    ).length;
    const pending = allUserReports.filter(
      (r) => r.status === "Pending" || r.status === "Under Review"
    ).length;
    const typeCounts = allUserReports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostCommonType =
      Object.keys(typeCounts).length > 0
        ? Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0]
        : "N/A";

    return { total, verified, pending, mostCommonType };
  }, [allUserReports]);

  const reportTypeDistribution = useMemo(() => {
    const counts = allUserReports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allUserReports]);

  const handleDelete = (reportId: string) => {
    setAllUserReports(
      allUserReports.filter((report) => report.id !== reportId)
    );
    toast.error("Report deleted from your vault.");
  };

  const handleSave = (updatedReport: UserReport) => {
    setAllUserReports(
      allUserReports.map((r) => (r.id === updatedReport.id ? updatedReport : r))
    );
  };

  const handleDownload = (report: UserReport) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Scam Report Summary", 14, 22);
    doc.setFontSize(11);
    doc.text(`Report ID: ${report.id}`, 14, 32);
    doc.text(`Date: ${report.date}`, 14, 38);
    autoTable(doc, {
      startY: 50,
      head: [["Field", "Details"]],
      body: [
        ["Type", report.type],
        ["Status", report.status],
        ["AI Risk Score", `${report.riskScore}/100 (${report.severity})`],
        ["Details", report.details],
      ],
      theme: "striped",
    });
    doc.save(`report-${report.id}.pdf`);
    toast.info("Report downloaded as PDF.");
  };

  const handleExportAll = () => {
    const doc = new jsPDF();
    doc.text(`All Reports for ${currentUser.name}`, 14, 22);
    const tableData = allUserReports.map((r) => [
      r.id,
      r.type,
      r.date,
      r.status,
      r.riskScore,
    ]);
    autoTable(doc, {
      startY: 30,
      head: [["ID", "Type", "Date", "Status", "Risk Score"]],
      body: tableData,
    });
    doc.save("all_my_reports.pdf");
    toast.success("All your reports have been exported to PDF.");
  };

  const PIE_COLORS = ["#3b82f6", "#f97316", "#10b981", "#ef4444", "#8b5cf6"];

  return (
    <div
      className={`flex min-h-screen bg-slate-100 dark:bg-gray-900 ${orbitron.className}`}
    >
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
            Here's your personal scam detection dashboard.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <KpiCard
            title="Total Reports"
            value={kpiData.total}
            icon={FileText}
            color="text-blue-500"
          />
          <KpiCard
            title="Verified Scams"
            value={kpiData.verified}
            icon={ShieldCheck}
            color="text-red-500"
          />
          <KpiCard
            title="Pending Review"
            value={kpiData.pending}
            icon={Clock}
            color="text-yellow-500"
          />
          <KpiCard
            title="Guardian Score"
            value={currentUser.guardianScore}
            icon={BarChart}
            color="text-green-500"
          />
          <Link href="/leaderboard" className="cursor-pointer">
            <KpiCard
              title="Leaderboard Rank"
              value={`#${currentUser.leaderboardRank}`}
              icon={Trophy}
              color="text-amber-500"
            />
          </Link>
        </div>

        {/* Main Content Area */}
        {activeView === "vault" && (
          <Card className="shadow-lg dark:bg-gray-800/50 mt-6">
            <CardHeader className="flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle>My Reports</CardTitle>
                <CardDescription>
                  A log of all the scams you've helped identify.
                </CardDescription>
              </div>
              <div className="flex gap-2 mt-4 sm:mt-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Verified Scam">Verified Scam</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Link href="/#report-scam">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Report New Scam
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AI Risk Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.type}
                        </TableCell>
                        <TableCell className="max-w-sm truncate">
                          {report.details}
                        </TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{report.riskScore}/100</span>
                            {getRiskBadge(report.riskScore)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <ReportEditDialog
                                report={report}
                                onSave={handleSave}
                              >
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              </ReportEditDialog>
                              <DropdownMenuItem
                                onClick={() => handleDownload(report)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => handleDelete(report.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No reports found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeView === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Reporting Habits</CardTitle>
                <CardDescription>
                  Breakdown of the scam types you've reported.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={reportTypeDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {reportTypeDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Trends and suggestions based on your reports.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Trending Threat</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      You've reported an increasing number of 'Phishing' scams.
                      Stay vigilant with emails from unknown senders.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <ShieldQuestion className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">AI Suggestion</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Consider enabling Two-Factor Authentication (2FA) on your
                      primary email account to better protect against phishing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === "settings" && (
          <Card className="shadow-lg dark:bg-gray-800/50 mt-6">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your profile, notifications, and data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={currentUser.name} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={currentUser.email}
                      disabled
                    />
                  </div>
                </div>
                <Button size="sm">Update Profile</Button>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <div className="flex items-center justify-between rounded-lg border p-4 dark:border-gray-700">
                  <div>
                    <Label htmlFor="email-notifications">
                      Email me when a report is verified
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get instant updates on your submissions.
                    </p>
                  </div>
                  <Switch id="email-notifications" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Management</h3>
                <div className="flex items-center justify-between rounded-lg border p-4 dark:border-gray-700">
                  <div>
                    <Label>Export My Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Download a PDF of all your submitted reports.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportAll}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
