"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  Trash2,
  Edit,
  Download,
  FileText,
  PlusCircle,
} from "lucide-react";
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
import Link from "next/link";

// Mock data representing reports fetched from a user's vault
const mockUserReports = [
  {
    id: "rep-001",
    type: "Phishing",
    date: "2024-05-21",
    status: "Verified Scam",
    details: "Email from 'Netflx' asking to update payment.",
  },
  {
    id: "rep-002",
    type: "Fake Job Offer",
    date: "2024-05-19",
    status: "Under Review",
    details: "WhatsApp message for a high-paying remote job.",
  },
  {
    id: "rep-003",
    type: "Bank Impersonation",
    date: "2024-05-15",
    status: "Pending",
    details: "SMS claiming my bank account was locked.",
  },
];

// Helper to determine badge color based on status
const getStatusBadge = (status: string) => {
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

export default function DashboardPage() {
  const [reports, setReports] = useState(mockUserReports);

  const handleDelete = (reportId: string) => {
    // In a real app, you'd call an API to delete this.
    // For now, we just filter it from the local state.
    setReports(reports.filter((report) => report.id !== reportId));
    // toast.success("Report deleted.");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Scam Evidence Vault
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
              Track and manage all your submitted scam reports.
            </p>
          </div>
          <Link href="/#report-scam">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Report a New Scam
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg dark:bg-gray-800/50">
          <CardHeader>
            <CardTitle>My Reports</CardTitle>
            <CardDescription>
              A log of all the scams you've helped identify.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Details
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.type}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-sm truncate">
                        {report.details}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {report.date}
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" disabled>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(report.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500"
                    >
                      <FileText className="mx-auto mb-2 h-8 w-8" />
                      You haven't reported any scams yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
