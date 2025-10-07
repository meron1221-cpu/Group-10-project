"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";
import { Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Compare password with your secret key from .env.local
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // Save simple session flag
      localStorage.setItem("isAdmin", "true");
      router.push("/admin"); // Redirect to the main admin dashboard
    } else {
      alert("Wrong password!");
      setPassword("");
    }
  };

  return (
    <div
      className={`flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 ${orbitron.className}`}
    >
      <Card className="w-full max-w-sm shadow-2xl animate-in fade-in-50 duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>Enter the administrative password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
