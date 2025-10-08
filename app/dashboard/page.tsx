"use client";

import { useState, useMemo, useEffect, useCallback, ReactNode } from "react";
import { Orbitron } from "next/font/google";
import { useSession, signOut, SessionProvider } from "next-auth/react";
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
  Settings,
  Save,
  Trophy,
  LogOut,
  Home,
  Loader2,
  FileDown,
  TrendingUp,
  ShieldQuestion,
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
import { Skeleton } from "@/components/ui/skeleton";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

interface UserReport {
  id: string;
  userId: string;
  type: string;
  date: string;
  status: "Verified Scam" | "Under Review" | "Pending";
  details: string;
  riskScore: number;
  severity: "Low" | "Medium" | "High";
}

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

  const handleSave = async () => {
    const updatedReport = { ...report, details, type };
    try {
      const response = await fetch(`/api/reports/${report.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReport),
      });
      if (response.ok) {
        onSave(updatedReport);
        toast.success("Report updated successfully!");
      } else {
        toast.error("Failed to update report.");
      }
    } catch (error) {
      toast.error("Error updating report.");
    }
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

function ReportSubmitDialog({
  onSubmit,
  children,
}: {
  onSubmit: (newReport: UserReport) => void;
  children: ReactNode;
}) {
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const { data: session } = useSession();

  const handleSubmit = async () => {
    if (!session?.user?.id || !type || !details) {
      toast.error("Please fill in all fields and ensure you're logged in.");
      return;
    }

    const newReport: UserReport = {
      id: `rep-${Date.now()}`,
      userId: session.user.id,
      type,
      details,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      riskScore: Math.floor(Math.random() * 30) + 60,
      severity: "Medium",
    };

    try {
      const response = await fetch("/api/reports/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scamType: type, description: details }),
      });
      if (response.ok) {
        const data = await response.json();
        onSubmit(data);
        toast.success("Report submitted successfully!");
        setType("");
        setDetails("");
      } else {
        toast.error("Failed to submit report.");
      }
    } catch (error) {
      toast.error("Error submitting report.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit New Report</DialogTitle>
          <DialogDescription>
            Provide details about the scam you encountered.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select scam type" />
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
              placeholder="Describe the scam..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
          <span className="text-2xl font-bold text-white">GashaSphere</span>
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
        <Link href="/leaderboard">
          <Button
            variant={activeView === "leaderboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Trophy className="mr-3 h-5 w-5" />
            Leaderboard
          </Button>
        </Link>
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

function DashboardPageContent() {
  const { data: session, status } = useSession();
  const [allUserReports, setAllUserReports] = useState<UserReport[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [activeView, setActiveView] = useState("vault");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUserReports = useCallback(async () => {
    if (!session?.user?.id) return;
    setIsLoadingReports(true);
    try {
      const response = await fetch("/api/user-reports");
      if (response.ok) {
        const data = await response.json();
        setAllUserReports(data.reports || []);
        setUserPoints(data.points || 0);
      } else {
        toast.error("Failed to fetch your reports.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching reports.");
    } finally {
      setIsLoadingReports(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserReports();
    }
  }, [status, fetchUserReports]);

  const filteredReports = useMemo(() => {
    return allUserReports.filter(
      (report) =>
        (report.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || report.status === statusFilter)
    );
  }, [allUserReports, searchTerm, statusFilter]);

  const totalReports = allUserReports.length;
  const verifiedScams = allUserReports.filter(
    (r) => r.status === "Verified Scam"
  ).length;
  const underReview = allUserReports.filter(
    (r) => r.status === "Under Review"
  ).length;
  const averageRisk =
    allUserReports.length > 0
      ? Math.round(
          allUserReports.reduce((sum, r) => sum + r.riskScore, 0) /
            allUserReports.length
        )
      : 0;

  const reportTypeDistribution = useMemo(() => {
    const types = allUserReports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [allUserReports]);

  const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/reports?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Report deleted successfully!");
        fetchUserReports();
      } else {
        toast.error("Failed to delete report.");
      }
    } catch (error) {
      toast.error("Error deleting report.");
    }
  };

  const handleSave = (updatedReport: UserReport) => {
    setAllUserReports((prev) =>
      prev.map((r) => (r.id === updatedReport.id ? updatedReport : r))
    );
  };

  const handleSubmit = (newReport: UserReport) => {
    setAllUserReports((prev) => [newReport, ...prev]);
    fetchUserReports(); // Refresh points and reports
  };

  const handleDownload = (report: UserReport) => {
    const doc = new jsPDF();
    doc.setFont("Orbitron", "normal");
    doc.text(`Report ID: ${report.id}`, 20, 20);
    doc.text(`Type: ${report.type}`, 20, 30);
    doc.text(`Date: ${report.date}`, 20, 40);
    doc.text(`Status: ${report.status}`, 20, 50);
    doc.text(`Details: ${report.details}`, 20, 60);
    doc.save(`report_${report.id}.pdf`);
  };

  const handleExportAll = () => {
    const doc = new jsPDF();
    doc.setFont("Orbitron", "normal");
    doc.text("All Submitted Reports", 20, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Type", "Details", "Date", "Status", "Risk Score", "Severity"]],
      body: allUserReports.map((report) => [
        report.type,
        report.details,
        report.date,
        report.status,
        report.riskScore,
        report.severity,
      ]),
      theme: "striped",
      styles: { font: "Orbitron" },
    });
    doc.save(`all_reports_${session?.user?.id}.pdf`);
  };

  return (
    <div
      className={`flex min-h-screen bg-gray-50 dark:bg-gray-900 ${orbitron.className}`}
    >
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-6 overflow-auto">
        {activeView === "vault" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Evidence Vault</h1>
              <ReportSubmitDialog onSubmit={handleSubmit}>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Submit New Report
                </Button>
              </ReportSubmitDialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KpiCard
                title="Total Reports"
                value={totalReports}
                icon={FileText}
                color="text-blue-500"
              />
              <KpiCard
                title="Verified Scams"
                value={verifiedScams}
                icon={ShieldCheck}
                color="text-green-500"
              />
              <KpiCard
                title="Under Review"
                value={underReview}
                icon={Clock}
                color="text-yellow-500"
              />
              <KpiCard
                title="Avg Risk Score"
                value={averageRisk}
                icon={AlertCircle}
                color="text-red-500"
              />
              <KpiCard
                title="Guardian Points"
                value={userPoints}
                icon={Trophy}
                color="text-yellow-500"
              />
            </div>
            <Card className="shadow-lg dark:bg-gray-800/50 mb-6">
              <CardHeader>
                <CardTitle>Filter Reports</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Verified Scam">Verified Scam</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            <Card className="shadow-lg dark:bg-gray-800/50">
              <CardHeader>
                <CardTitle>Your Submitted Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingReports ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Risk</TableHead>
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
                            <TableCell>
                              {getStatusBadge(report.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{report.riskScore}/100</span>
                                {getRiskBadge(report.riskScore)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
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
                )}
              </CardContent>
            </Card>
          </>
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
                    <Input id="name" defaultValue={session?.user?.name || ""} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={session?.user?.email || ""}
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

export default function DashboardPageWrapper() {
  return (
    <SessionProvider>
      <DashboardPageContent />
    </SessionProvider>
  );
}
