"use client";

import { Orbitron } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

// --- FONT SETUP ---
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Mock blog posts with better images
const blogPosts = [
  {
    id: 1,
    title: "Scam of the Week: The Rise of Deepfake Voice Scams",
    excerpt:
      "Learn how AI is being used to mimic voices and how to protect yourself from sophisticated deepfake scams.",
    link: "/blog/deepfake-voice-scams",
    image:
      "https://images.unsplash.com/photo-1611162617213-6d22e7f2c9b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    date: "May 20, 2024",
  },
  {
    id: 2,
    title: "Anatomy of an Ethio Telecom Impersonation Scam",
    excerpt:
      "We break down a recent SMS scam targeting mobile users in Ethiopia, detailing its tactics and how GuardSphere detects it.",
    link: "/blog/ethio-telecom-impersonation",
    image:
      "https://images.unsplash.com/photo-1554230522-3273b385a35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    date: "May 13, 2024",
  },
  {
    id: 3,
    title: "Understanding Phishing: The Basics of Online Deception",
    excerpt:
      "A foundational guide to identifying and avoiding common phishing attacks, from email to social media.",
    link: "/blog/understanding-phishing",
    image:
      "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    date: "May 06, 2024",
  },
];

export default function BlogPage() {
  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 py-12 ${orbitron.className}`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
            GuardSphere Blog & Resource Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Deep dives into recent threats, cybersecurity best practices, and
            how GuardSphere keeps you safe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link href={post.link} key={post.id} passHref>
              <motion.div
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800/50 cursor-pointer">
                  {post.image && (
                    <div className="relative w-full h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {post.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button variant="link" className="p-0">
                      Read More <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
