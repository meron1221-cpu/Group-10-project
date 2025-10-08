"use client";

import { useState, useEffect, useCallback } from "react";
import { Orbitron } from "next/font/google";
import { useSession, SessionProvider } from "next-auth/react";
import Link from "next/link";
import {
  Trophy,
  Award,
  ArrowLeft,
  Shield,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// --- FONT SETUP ---
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  points: number;
  reports: number;
  rank?: number;
}

// --- MAIN PAGE CONTENT COMPONENT ---
function LeaderboardPageContent() {
  const { data: session, status } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    try {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const data: LeaderboardUser[] = await response.json();

      const sortedLeaderboard = data
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({ ...user, rank: index + 1 }));

      setLeaderboard(sortedLeaderboard);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setError("Could not load leaderboard data.");
      toast.error("Failed to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchLeaderboard();
      const interval = setInterval(fetchLeaderboard, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [fetchLeaderboard, status]);

  const currentUserRank = leaderboard.find(
    (user) => user.id === session?.user?.id
  )?.rank;

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 py-12 ${orbitron.className}`}
    >
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              GashaSphere
            </span>
          </div>
          <div className="flex items-center gap-4">
            {currentUserRank && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Your Rank: #{currentUserRank}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchLeaderboard}
              disabled={loading}
            >
              <RefreshCw
                className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
            Top Threat Hunters
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            See who's leading the charge in protecting our community! Earn
            points by reporting scams and contributing to cybersecurity.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Loader2 className="mx-auto h-12 w-12 animate-spin" />
            <p>Loading leaderboard...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <Card className="max-w-4xl mx-auto shadow-lg dark:bg-gray-800/50">
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>Ranked by Guardian Points</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-center">Reports</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((user) => (
                    <TableRow
                      key={user.id}
                      className={
                        user.id === session?.user?.id
                          ? "bg-blue-50 dark:bg-blue-900/30"
                          : ""
                      }
                    >
                      <TableCell className="font-bold text-lg">
                        {user.rank === 1 && (
                          <Award className="inline-block h-5 w-5 text-yellow-500 mr-1" />
                        )}
                        {user.rank === 2 && (
                          <Award className="inline-block h-5 w-5 text-gray-400 mr-1" />
                        )}
                        {user.rank === 3 && (
                          <Award className="inline-block h-5 w-5 text-amber-700 mr-1" />
                        )}
                        {(user.rank || 0) > 3 && (
                          <span className="mr-1">#</span>
                        )}
                        {user.rank || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {user.reports}
                      </TableCell>
                      <TableCell className="text-right font-bold text-blue-600 dark:text-blue-400">
                        {user.points}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <SessionProvider>
      <LeaderboardPageContent />
    </SessionProvider>
  );
}
