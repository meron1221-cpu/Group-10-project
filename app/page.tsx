"use client";

import {
  Shield,
  Mail,
  AlertTriangle,
  CheckCircle,
  Upload,
  Type,
  Users,
  Target,
  Send,
  Star,
  Eye,
  BrainCircuit,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";

// A reusable component for scroll-triggered animations
function AnimatedSection({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// A reusable component for the animated number counter
function Counter({ to }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(0, to, {
        duration: 2,
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toLocaleString();
          }
        },
      });
    }
  }, [isInView, to]);

  return <span ref={ref}>0</span>;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              GuardSphere
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              About Us
            </Link>
            <Link
              href="#team"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Team
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>
          <Link href="/analyze">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-shadow">
              Analyze Email
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section - Visually Enhanced with Professional Font */}
        <section className="relative font-sans py-24 md:py-32 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
          {/* Animated blobs for a dynamic background */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

          <div className="container mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="max-w-4xl mx-auto">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight"
                >
                  Protect Yourself from{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                    Phishing Attacks
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="text-xl text-gray-600 font-normal mb-10 leading-relaxed"
                >
                  Our advanced AI-powered system analyzes emails in real-time to
                  detect phishing attempts, keeping you safe from cybercriminals
                  and protecting your sensitive information.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link href="/analyze">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/40"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Analyze Email Now
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto px-8 py-6 text-lg transition-transform hover:scale-105 bg-white/70 backdrop-blur-sm border-gray-300 hover:bg-white"
                    >
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Stats Section */}
        <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Our Impact
                </h2>
                <p className="text-md md:text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
                  Real-time phishing detection with proven results.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    value: "99.7%",
                    label: "Detection Accuracy",
                    icon: Shield,
                    color: "text-blue-600",
                  },
                  {
                    value: "<1s",
                    label: "Analysis Time",
                    icon: Mail,
                    color: "text-green-500",
                  },
                  {
                    value: "1M+",
                    label: "Emails Analyzed",
                    icon: Users,
                    color: "text-purple-600",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03, y: -3 }}
                    className="bg-white rounded-xl p-6 shadow flex flex-col items-center justify-center transition-all duration-300"
                  >
                    <div className="mb-3 p-3 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100">
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className={`text-4xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-600 text-sm md:text-base">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-slate-50">
          <div className="container mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  Advanced Phishing Detection
                </h2>
                <p className="text-md md:text-lg text-gray-600 max-w-2xl mx-auto">
                  Our AI model analyzes multiple indicators to provide
                  comprehensive, real-time protection against phishing attacks.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: AlertTriangle,
                  title: "Suspicious Links",
                  description:
                    "Detects malicious URLs, shortened links, and domain spoofing attempts.",
                },
                {
                  icon: Type,
                  title: "Content Analysis",
                  description:
                    "Analyzes for urgent language, spelling errors, and social engineering tactics.",
                },
                {
                  icon: Mail,
                  title: "Header Inspection",
                  description:
                    "Examines email headers for authentication failures and sender reputation.",
                },
                {
                  icon: Upload,
                  title: "File Upload",
                  description:
                    "Support for .eml files and direct email content analysis.",
                },
                {
                  icon: CheckCircle,
                  title: "Real-time Results",
                  description:
                    "Get instant analysis with detailed explanations and confidence scores.",
                },
                {
                  icon: Shield,
                  title: "Privacy First",
                  description:
                    "Your emails are analyzed securely and never stored on our servers.",
                },
              ].map((feature, index) => (
                <AnimatedSection key={index}>
                  <motion.div whileHover={{ y: -6, scale: 1.03 }}>
                    <Card className="h-full text-center shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-transparent hover:border-blue-500 rounded-lg">
                      <CardHeader className="items-center p-6">
                        <div className="bg-blue-100 p-4 rounded-full mb-4 inline-flex justify-center items-center">
                          <feature.icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg md:text-xl font-semibold mb-1">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base text-gray-600">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section - Enhanced */}
        <section
          id="about"
          className="py-24 md:py-32 bg-white relative overflow-hidden"
        >
          {/* Subtle background dot pattern */}
          <div
            className="absolute inset-0 bg-[url('data:image/svg+xml,<svg_width=%2220%22_height=%2220%22_viewBox=%220_0_20_20%22_xmlns=%22http://www.w3.org/2000/svg%22><circle_fill=%22%23e2e8f0%22_cx=%2210%22_cy=%2210%22_r=%221%22/></svg>')] opacity-30"
            style={{ backgroundRepeat: "repeat" }}
          ></div>

          <div className="container mx-auto px-4 relative">
            <AnimatedSection>
              <div className="text-center mb-16 md:mb-24">
                <h2 className="text-3xl md:text-5xl font-extrabold text-blue-500 mb-4 tracking-tight">
                  Forging a Safer Digital Frontier
                </h2>

                <p className="text-md md:text-lg text-gray-600 max-w-2xl mx-auto">
                  At GuardSphere, we're not just building software; we're
                  building trust. Our mission is to democratize cybersecurity
                  and empower everyone to navigate the digital world with
                  confidence.
                </p>
              </div>
            </AnimatedSection>

            <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
              {/* Left Column: Abstract Visual */}
              <AnimatedSection className="relative h-80 lg:h-auto mb-12 lg:mb-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl shadow-2xl transform -rotate-2"></div>
                <div className="relative h-full w-full p-6 flex items-center justify-center rounded-2xl bg-gray-900/20 backdrop-blur-lg border border-white/10">
                  <svg
                    className="w-3/4 h-3/4 text-white/30"
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      d="M 100,100 m -75,0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                      d="M25,100 C40,50 70,40 100,50 C130,60 160,50 175,100"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                      d="M25,100 C40,150 70,160 100,150 C130,140 160,150 175,100"
                    />
                    <circle cx="50" cy="75" r="3" fill="currentColor" />
                    <circle cx="150" cy="125" r="3" fill="currentColor" />
                    <circle cx="100" cy="50" r="3" fill="currentColor" />
                  </svg>
                </div>
              </AnimatedSection>

              {/* Right Column: Core Values */}
              <AnimatedSection className="relative">
                <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200/50">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                    Our Core Values
                  </h3>
                  <ul className="space-y-6 md:space-y-8">
                    {[
                      {
                        icon: Eye,
                        title: "Vigilance",
                        description:
                          "We monitor threats to stay ahead of cybercriminals, keeping defenses proactive.",
                      },
                      {
                        icon: BrainCircuit,
                        title: "Intelligence",
                        description:
                          "We leverage AI for accurate detection, turning complex data into clear insights.",
                      },
                      {
                        icon: ShieldCheck,
                        title: "Accessibility",
                        description:
                          "Security should be simple and intuitive, available to everyone regardless of expertise.",
                      },
                    ].map((value, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="bg-blue-100 p-3 rounded-full mr-5 flex-shrink-0 ring-4 ring-blue-50">
                          <value.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg md:text-xl font-semibold">
                            {value.title}
                          </h4>
                          <p className="text-gray-600 mt-1 text-sm md:text-base">
                            {value.description}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Updated */}
        <section
          id="testimonials"
          className="py-24 bg-gradient-to-br from-white to-slate-100 relative"
        >
          <div className="container mx-auto px-4">
            {/* Section Heading */}
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-blue-500">
                  What Our Users Say
                </h2>
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-1 bg-blue-500 rounded-full"></div>
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We're proud to have earned the trust of professionals
                  worldwide.
                </p>
              </div>
            </AnimatedSection>

            {/* Testimonial Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "GuardSphere is a game-changer. It caught a sophisticated phishing email that our traditional filters missed. Highly recommended!",
                  name: "Sarah L.",
                  role: "IT Manager, TechCorp",
                },
                {
                  quote:
                    "The peace of mind this tool provides is invaluable. The analysis is fast, accurate, and easy to understand.",
                  name: "Michael B.",
                  role: "Small Business Owner",
                },
                {
                  quote:
                    "As a freelance developer, I handle sensitive client data. GuardSphere is my first line of defense. Simple, powerful, and effective.",
                  name: "Jessica P.",
                  role: "Freelance Developer",
                },
              ].map((testimonial, index) => (
                <AnimatedSection key={index}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col justify-between shadow-xl rounded-2xl border border-gray-200 hover:shadow-2xl transition-transform hover:scale-105 bg-white/80 backdrop-blur-sm min-h-[320px]">
                      <CardContent className="pt-6 px-6 flex-1">
                        <div className="flex space-x-1 text-yellow-400 mb-4 drop-shadow-md">
                          <Star fill="currentColor" />
                          <Star fill="currentColor" />
                          <Star fill="currentColor" />
                          <Star fill="currentColor" />
                          <Star fill="currentColor" />
                        </div>
                        <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                          "{testimonial.quote}"
                        </blockquote>
                      </CardContent>
                      <CardHeader className="pt-4 px-6">
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {testimonial.role}
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
        {/* Team Section - Updated */}
        <section
          id="team"
          className="py-24 bg-gradient-to-br from-white to-slate-50 relative"
        >
          <div className="container mx-auto px-4">
            {/* Section Heading */}
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-blue-500">
                  Meet Our Team
                </h2>
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-1 bg-blue-500 rounded-full"></div>
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We are a passionate team of security researchers, AI
                  specialists, and software engineers.
                </p>
              </div>
            </AnimatedSection>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                { name: "Aphran Mohammed", role: "Lead AI Researcher" },
                { name: "Nahom Bekele", role: "Head of Engineering" },
                { name: "Dawit Addis", role: "Cybersecurity Analyst" },
                { name: "Meron Nisrane", role: "Penetration Tester" },
                { name: "Amanuel", role: "Product Manager" },
              ].map((member, index) => (
                <AnimatedSection key={index}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col items-center text-center shadow-xl rounded-2xl border border-gray-200 hover:shadow-2xl transition-transform bg-white/90 backdrop-blur-sm min-h-[350px] p-6">
                      <img
                        src={`https://i.pravatar.cc/150?u=${member.name}`}
                        alt={member.name}
                        className="w-28 h-28 rounded-full mb-4 border-4 border-blue-100 shadow-md"
                      />
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {member.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-2">
                        {member.role}
                      </CardDescription>
                    </Card>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Us Section - Enhanced Form */}
        <section
          id="contact"
          className="py-24 bg-slate-50 relative overflow-hidden"
        >
          {/* Decorative Background Circles */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>

          <div className="container mx-auto px-4 relative">
            <AnimatedSection>
              {/* Section Heading */}
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-blue-500 mb-4 tracking-tight">
                  Get In Touch
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Have questions or want to partner with us? We'd love to hear
                  from you.
                </p>
              </div>

              {/* Contact Form */}
              <div className="max-w-2xl mx-auto">
                <Card className="shadow-2xl rounded-3xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-shadow duration-500">
                  <CardContent className="p-8 bg-white/90 backdrop-blur-md space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div className="relative">
                        <Input
                          id="name"
                          placeholder=" "
                          className="peer border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-4 w-full"
                        />
                        <label
                          htmlFor="name"
                          className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm"
                        >
                          Your Name
                        </label>
                      </div>

                      {/* Email Field */}
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder=" "
                          className="peer border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-4 w-full"
                        />
                        <label
                          htmlFor="email"
                          className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm"
                        >
                          Your Email
                        </label>
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div className="relative">
                      <Input
                        id="subject"
                        placeholder=" "
                        className="peer border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-4 w-full"
                      />
                      <label
                        htmlFor="subject"
                        className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm"
                      >
                        Subject
                      </label>
                    </div>

                    {/* Message Field */}
                    <div className="relative">
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder=" "
                        className="peer border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-4 w-full resize-none"
                      />
                      <label
                        htmlFor="message"
                        className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm"
                      >
                        Your Message
                      </label>
                    </div>

                    {/* Submit Button */}
                    {/* Submit Button */}
                    <div className="flex justify-center mt-4">
                      <Button
                        size="md"
                        className="w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base transition-transform hover:scale-105 flex items-center justify-center gap-2 rounded-lg shadow-md hover:shadow-lg"
                      >
                        <Send className="h-4 w-4" />
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">GuardSphere</span>
              </div>
              <p className="text-gray-400">
                Advanced AI-powered phishing detection to keep you safe online.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#team"
                    className="hover:text-white transition-colors"
                  >
                    Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                  <Link
                    href="/admin"
                    className="hover:text-white transition-colors text-xs opacity-60"
                  >
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4">
                Get the latest cybersecurity news and product updates.
              </p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 rounded-r-none text-white"
                />
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 rounded-l-none"
                >
                  Go
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} GuardSphere. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
