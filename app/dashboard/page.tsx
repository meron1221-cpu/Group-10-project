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
  Upload,
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
  evidenceFile?: File | null;
  evidenceDataUrl?: string;
}

const SCAM_TYPES = [
  "Phishing",
  "Fake Job Offer",
  "Bank Impersonation",
  "Investment Fraud",
  "Lottery Scam",
  "Tech Support Scam",
  "Others",
];

// --- NEW: Dashboard Scam Checker Component ---
interface ScamResult {
  prediction: string;
  confidence: number;
  is_scam: boolean;
}

function DashboardScamChecker() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<ScamResult | null>(null);
  const [loading, setLoading] = useState(false);

  const checkScam = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      // In a real app, this would be a real API call.
      // We simulate it here.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const isScam = /prize|won|urgent|verify|account|password/i.test(message);
      const confidence = isScam
        ? 0.8 + Math.random() * 0.19
        : 0.1 + Math.random() * 0.4;
      setResult({
        prediction: isScam ? "Scam" : "Safe",
        confidence,
        is_scam: isScam,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to analyze the message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg dark:bg-gray-800/50">
      <CardHeader>
        <CardTitle>Quick Scam Check</CardTitle>
        <CardDescription>
          Paste a suspicious message to get an instant AI analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste suspicious message..."
          className="w-full p-2 border rounded text-sm mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />
        <Button
          onClick={checkScam}
          disabled={loading}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check"
          )}
        </Button>
        {result && (
          <div
            className={`mt-4 p-3 rounded text-sm font-semibold text-center ${
              result.is_scam
                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
            }`}
          >
            {result.is_scam ? "LIKELY SCAM" : "LIKELY SAFE"} (
            {(result.confidence * 100).toFixed(0)}% Confidence)
          </div>
        )}
      </CardContent>
    </Card>
  );
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave(updatedReport);
      toast.success("Report updated successfully!");
    } catch (error) {
      toast.error("Error updating report.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] ${orbitron.className}`}>
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
                {SCAM_TYPES.map((scamType) => (
                  <SelectItem key={scamType} value={scamType}>
                    {scamType}
                  </SelectItem>
                ))}
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
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidenceDataUrl, setEvidenceDataUrl] = useState<string | undefined>();
  const { data: session } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEvidenceFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidenceDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setEvidenceDataUrl(undefined);
    }
  };

  const handleSubmit = async () => {
    if (!session?.user?.id || !type || !details) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const reportId = Date.now();

    const newScamForAdmin = {
      id: reportId,
      scamType: type,
      description: details,
      timestamp: reportId,
      evidenceDataUrl,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const pendingScams = JSON.parse(
        localStorage.getItem("pendingScams") || "[]"
      );
      pendingScams.push(newScamForAdmin);
      localStorage.setItem("pendingScams", JSON.stringify(pendingScams));

      const fullReport: UserReport = {
        id: reportId.toString(),
        userId: session.user.id,
        type,
        details,
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
        riskScore: Math.floor(Math.random() * 30) + 60,
        severity: "Medium",
        evidenceFile,
        evidenceDataUrl,
      };

      onSubmit(fullReport);
      toast.success("Report submitted! It is now pending review by an admin.");

      setType("");
      setDetails("");
      setEvidenceFile(null);
      setEvidenceDataUrl(undefined);
    } catch (error) {
      toast.error("Error submitting report.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] ${orbitron.className}`}>
        <DialogHeader>
          <DialogTitle>Submit New Report</DialogTitle>
          <DialogDescription>
            Provide details about the scam you encountered. Your report will be
            reviewed by an admin.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Type of Scam</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select scam type" />
              </SelectTrigger>
              <SelectContent>
                {SCAM_TYPES.map((scamType) => (
                  <SelectItem key={scamType} value={scamType}>
                    {scamType}
                  </SelectItem>
                ))}
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
          <div className="grid gap-2">
            <Label htmlFor="evidence">Upload Evidence (Optional)</Label>
            <Input id="evidence" type="file" onChange={handleFileChange} />
            {evidenceFile && (
              <p className="text-sm text-muted-foreground">
                File selected: {evidenceFile.name}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit for Review
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
      const storedReports = JSON.parse(
        localStorage.getItem(`userReports_${session.user.id}`) || "[]"
      );
      if (storedReports.length > 0) {
        setAllUserReports(storedReports);
      } else {
        const response = await fetch("/api/user-reports");
        if (response.ok) {
          const data = await response.json();
          setAllUserReports(data.reports || []);
          setUserPoints(data.points || 0);
        } else {
          toast.error("Failed to fetch your reports.");
        }
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

  useEffect(() => {
    if (session?.user?.id && allUserReports.length > 0) {
      localStorage.setItem(
        `userReports_${session.user.id}`,
        JSON.stringify(allUserReports)
      );
    }
  }, [allUserReports, session?.user?.id]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "approvedScams" && event.newValue) {
        const approvedScams = JSON.parse(event.newValue);
        const approvedIds = new Set(
          approvedScams.map((s: any) => s.id.toString())
        );

        setAllUserReports((currentReports) => {
          let wasUpdated = false;
          const updatedReports = currentReports.map((report) => {
            if (
              approvedIds.has(report.id) &&
              report.status !== "Verified Scam"
            ) {
              wasUpdated = true;
              return { ...report, status: "Verified Scam" as const };
            }
            return report;
          });

          if (wasUpdated) {
            toast.success("One of your reports has been verified as a scam!");
            return updatedReports;
          }
          return currentReports;
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
    (r) => r.status === "Under Review" || r.status === "Pending"
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
    const originalReports = allUserReports;
    const updatedReports = originalReports.filter((r) => r.id !== id);
    setAllUserReports(updatedReports);

    const pendingScams = JSON.parse(
      localStorage.getItem("pendingScams") || "[]"
    );
    const updatedPending = pendingScams.filter(
      (s: any) => s.id.toString() !== id
    );
    localStorage.setItem("pendingScams", JSON.stringify(updatedPending));

    toast.success("Report deleted successfully!");
  };

  const handleSave = (updatedReport: UserReport) => {
    setAllUserReports((prev) =>
      prev.map((r) => (r.id === updatedReport.id ? updatedReport : r))
    );
    const pendingScams = JSON.parse(
      localStorage.getItem("pendingScams") || "[]"
    );
    const updatedPending = pendingScams.map((s: any) =>
      s.id.toString() === updatedReport.id
        ? {
            ...s,
            scamType: updatedReport.type,
            description: updatedReport.details,
          }
        : s
    );
    localStorage.setItem("pendingScams", JSON.stringify(updatedPending));
  };

  const handleSubmit = (newReport: UserReport) => {
    setAllUserReports((prev) => [newReport, ...prev]);
  };

  const handleDownload = (report: UserReport) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Scam Report", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.text(`Report ID: ${report.id}`, 20, 30);
    doc.text(`Submitted By: ${session?.user?.name || "N/A"}`, 20, 40);
    doc.text(`Date: ${report.date}`, 20, 50);
    doc.text(`Status: ${report.status}`, 20, 60);
    doc.text(`Risk Score: ${report.riskScore}/100`, 20, 70);
    doc.text(`Details: ${report.details}`, 20, 80);
    doc.save(`report_${report.id}.pdf`);
  };

  const handleExportAll = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
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
      styles: { font: "helvetica" },
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
            <div className="flex justify-between items-start mb-6">
              <div>
                {session?.user?.name && (
                  <h1 className="text-3xl font-bold">
                    Welcome, {session.user.name}!
                  </h1>
                )}
                <p className="text-lg text-muted-foreground">Evidence Vault</p>
              </div>
              <ReportSubmitDialog onSubmit={handleSubmit}>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Submit New Report
                </Button>
              </ReportSubmitDialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
                title="Guardian Points"
                value={userPoints}
                icon={Trophy}
                color="text-yellow-500"
              />
              <div className="md:col-span-2 lg:col-span-1">
                <DashboardScamChecker />
              </div>
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
                                      disabled={
                                        report.status === "Verified Scam"
                                      }
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
