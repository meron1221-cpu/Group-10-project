"use client";

import { useState, useMemo, useEffect, ReactNode } from "react";
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
  Trophy,
  LogOut,
  Home,
  Save,
  TrendingUp,
  ShieldQuestion,
  FileDown,
  Loader2,
  Settings,
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

// ... (getStatusBadge, getRiskBadge, and ReportEditDialog components remain the same)

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
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [activeView, setActiveView] = useState("vault");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUserReports = async () => {
    if (!session?.user?.id) return;
    setIsLoadingReports(true);
    try {
      const response = await fetch("/api/user-reports");
      if (response.ok) {
        const data = await response.json();
        setAllUserReports(data.reports || []);
      } else {
        toast.error("Failed to fetch your reports.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching reports.");
    } finally {
      setIsLoadingReports(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserReports();
    }
  }, [status]);

  const filteredReports = useMemo(() => {
    return allUserReports.filter(
      (report) =>
        (report.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || report.status === statusFilter)
    );
  }, [allUserReports, searchTerm, statusFilter]);

  const kpiData = useMemo(
    () => ({
      total: allUserReports.length,
      verified: allUserReports.filter((r) => r.status === "Verified Scam")
        .length,
      pending: allUserReports.filter(
        (r) => r.status === "Pending" || r.status === "Under Review"
      ).length,
    }),
    [allUserReports]
  );

  // ... (handleDelete, handleSave, handleDownload, etc. remain the same)

  if (status === "loading") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen bg-slate-100 dark:bg-gray-900 ${orbitron.className}`}
    >
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome, {session?.user?.name || "User"}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
            Here's your personal scam detection dashboard.
          </p>
        </div>

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
            value={session?.user?.guardianScore || 0}
            icon={BarChart}
            color="text-green-500"
          />
          <Link href="/leaderboard" className="cursor-pointer">
            <KpiCard
              title="Leaderboard Rank"
              value={`#${session?.user?.leaderboardRank || "N/A"}`}
              icon={Trophy}
              color="text-amber-500"
            />
          </Link>
        </div>

        {activeView === "vault" && (
          <Card className="shadow-lg dark:bg-gray-800/50 mt-6">
            <CardHeader>{/* ... CardHeader content ... */}</CardHeader>
            <CardContent>
              {isLoadingReports ? (
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>{/* ... Table content ... */}</Table>
              )}
            </CardContent>
          </Card>
        )}
        {/* ... other views ... */}
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
