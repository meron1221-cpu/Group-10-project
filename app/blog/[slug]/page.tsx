import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for a single blog post
const mockBlogPost = {
  slug: "deepfake-voice-scams",
  title: "Scam of the Week: The Rise of Deepfake Voice Scams",
  date: "May 20, 2024",
  author: "GuardSphere Team",
  image:
    "https://via.placeholder.com/800x400/FF0000/FFFFFF?text=Deepfake+Voice+Scam",
  content: `
    <p class="mb-4">Deepfake technology, once a novelty, is now being weaponized by scammers to create highly convincing voice impersonations. These sophisticated attacks can mimic the voice of a loved one, a CEO, or even a government official, making it incredibly difficult for victims to detect the deception.</p>
    <h2 class="text-2xl font-bold mb-3">How Deepfake Voice Scams Work</h2>
    <p class="mb-4">Scammers typically gather audio samples of their target's voice from social media, public interviews, or even voicemail messages. They then use AI software to generate new speech that sounds exactly like the target, delivering a fraudulent message.</p>
    <p class="mb-4">Common scenarios include:
      <ul class="list-disc list-inside ml-4 mb-4">
        <li>A "child" calling a parent in distress, needing urgent money.</li>
        <li>A "CEO" instructing an employee to make an immediate wire transfer.</li>
        <li>A "bank representative" asking for personal information due to a "security breach."</li>
      </ul>
    </p>
    <h2 class="text-2xl font-bold mb-3">What to Look For</h2>
    <p class="mb-4">While deepfakes are convincing, there are often subtle clues:</p>
    <ul class="list-disc list-inside ml-4 mb-4">
      <li><strong>Unusual Requests:</strong> Any request for money, personal information, or urgent action should be a red flag.</li>
      <li><strong>Emotional Manipulation:</strong> Scammers often try to create panic or urgency to bypass critical thinking.</li>
      <li><strong>Poor Audio Quality:</strong> Sometimes, the deepfake audio might have slight distortions or sound unnatural.</li>
      <li><strong>Unfamiliar Numbers:</strong> Even if the voice is familiar, check the caller ID.</li>
    </ul>
    <h2 class="text-2xl font-bold mb-3">How GuardSphere Protects You</h2>
    <p class="mb-4">While GuardSphere's primary focus is text-based analysis, our AI models are constantly evolving to detect patterns associated with social engineering tactics often used in conjunction with deepfake scams. Our tools can analyze accompanying text messages or emails for suspicious links, urgent language, and requests for sensitive information that might precede or follow a deepfake call.</p>
    <p class="mb-4"><strong>Remember:</strong> Always verify unexpected requests through a separate, trusted channel. If your "child" calls asking for money, call them back on their known number. If your "CEO" emails for a transfer, call them on their office line.</p>
  `,
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // In a real app, you'd fetch post data based on params.slug
  const post = mockBlogPost; // Using mock data for demonstration

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Blog</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">GuardSphere</span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <article className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {post.image && (
            <div className="relative w-full h-80">
              <Image
                src={post.image}
                alt={post.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 space-x-4">
              <span className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" /> {post.date}
              </span>
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" /> {post.author}
              </span>
            </div>
            <div
              className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </main>
    </div>
  );
}
