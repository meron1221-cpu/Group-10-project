"use client";

import { useState, useEffect } from "react";
import { Trophy, Award, User, ArrowLeft, Shield } from "lucide-react";
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
import Link from "next/link";

// 1. Import the Orbitron font
import { Orbitron } from "next/font/google";

// 2. Initialize the font with desired weights
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

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const mockUsers = [
          {
            id: "user-1",
            name: "Aphran Mohammed",
            email: "aphran@example.com",
            points: 1500,
            reports: 150,
          },
          {
            id: "user-2",
            name: "Nahom Bekele",
            email: "nahom@example.com",
            points: 1200,
            reports: 120,
          },
          {
            id: "user-3",
            name: "Meron Nisrane",
            email: "meron@example.com",
            points: 950,
            reports: 95,
          },
          {
            id: "user-4",
            name: "Dawit Addis",
            email: "dawit@example.com",
            points: 800,
            reports: 80,
          },
          {
            id: "user-5",
            name: "Amanuel",
            email: "amanuel@example.com",
            points: 700,
            reports: 70,
          },
          {
            id: "user-6",
            name: "User Six",
            email: "user6@example.com",
            points: 500,
            reports: 50,
          },
          {
            id: "user-7",
            name: "User Seven",
            email: "user7@example.com",
            points: 300,
            reports: 30,
          },
          {
            id: "user-8",
            name: "User Eight",
            email: "user8@example.com",
            points: 100,
            reports: 10,
          },
        ];

        const sortedLeaderboard = mockUsers
          .sort((a, b) => b.points - a.points)
          .map((user, index) => ({ ...user, rank: index + 1 }));

        setLeaderboard(sortedLeaderboard);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Could not load leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    // 3. Apply the font's className to the main container div
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 py-12 ${orbitron.className}`}
    >
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              GuardSphere
            </span>
          </div>
          <div className="w-20" /> {/* Spacer */}
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
            Loading leaderboard...
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
                    <TableRow key={user.id}>
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
