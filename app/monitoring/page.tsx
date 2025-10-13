// "use client";

// import { useState, useMemo, useEffect, ReactNode } from "react";
// import { Orbitron } from "next/font/google";
// import { useSession, SessionProvider } from "next-auth/react";
// import Link from "next/link";
// import {
//   ShieldCheck,
//   Clock,
//   AlertCircle,
//   Trash2,
//   Edit,
//   Download,
//   FileText,
//   PlusCircle,
//   Search,
//   MoreHorizontal,
//   BarChart,
//   Bell,
//   User,
//   FileDown,
//   Map,
//   Settings,
//   X,
//   Save,
//   Flag,
//   ShieldQuestion,
//   TrendingUp,
//   Trophy,
//   LogOut,
//   Home,
//   Globe,
//   Loader2,
//   Link as LinkIcon,
//   ShieldAlert,
// } from "lucide-react";
// import { toast } from "sonner";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip as RechartsTooltip,
//   Legend,
// } from "recharts";

// // UI Components
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
// import { Skeleton } from "@/components/ui/skeleton";
// import { motion } from "framer-motion";

// // --- FONT SETUP ---
// const orbitron = Orbitron({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800", "900"],
//   variable: "--font-orbitron", // Define a CSS variable for global use
// });

// // --- TYPES & MOCK DATA ---
// interface DetectedThreat {
//   id: string;
//   suspiciousDomain: string;
//   originalDomain: string;
//   detectedAt: string;
//   risk: "High" | "Medium";
// }

// // --- HELPER COMPONENTS ---
// function AnimatedSection({ children }: { children: ReactNode }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//     >
//       {children}
//     </motion.div>
//   );
// }

// // --- MAIN PAGE CONTENT COMPONENT ---
// function MonitoringPageContent() {
//   const { data: session, status } = useSession();
//   const mockSession = {
//     user: { id: "user-123", name: "Alex Ryder", email: "alex@example.com" },
//   };
//   // Always provide a session, either the real one or the mock one.
//   const currentSession = session || mockSession;

//   const [monitoredDomains, setMonitoredDomains] = useState<string[]>([]);
//   const [newDomain, setNewDomain] = useState("");
//   const [detectedThreats, setDetectedThreats] = useState<DetectedThreat[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Load data from localStorage on initial mount
//   useEffect(() => {
//     if (currentSession?.user?.id) {
//       const savedDomains = localStorage.getItem(
//         `monitoredDomains_${currentSession.user.id}`
//       );
//       if (savedDomains) {
//         setMonitoredDomains(JSON.parse(savedDomains));
//       }
//       const savedThreats = localStorage.getItem(
//         `detectedThreats_${currentSession.user.id}`
//       );
//       if (savedThreats) {
//         setDetectedThreats(JSON.parse(savedThreats));
//       }
//     }
//     setIsLoading(false);
//   }, [currentSession?.user?.id]);

//   // --- Real-time monitoring simulation ---
//   useEffect(() => {
//     if (monitoredDomains.length === 0) {
//       return; // Don't run the interval if no domains are monitored
//     }

//     const intervalId = setInterval(() => {
//       // Pick a random domain to scan to make it feel more natural
//       const randomDomain =
//         monitoredDomains[Math.floor(Math.random() * monitoredDomains.length)];
//       simulateThreatDetection(randomDomain);
//     }, 15000); // Simulate a scan every 15 seconds

//     return () => clearInterval(intervalId); // Cleanup on component unmount
//   }, [monitoredDomains]);

//   // --- Realistic Threat Simulation Logic ---
//   const simulateThreatDetection = (domain: string) => {
//     // Only find a threat about 50% of the time to make it feel more realistic
//     if (Math.random() < 0.5) {
//       // We can skip the toast message for "no threats" to reduce noise
//       // toast.info(`Scan complete for ${domain}. No immediate threats found.`);
//       return;
//     }

//     let suspiciousDomain = "";
//     const domainParts = domain.split(".");
//     const name = domainParts[0];
//     const tld = domainParts.slice(1).join(".");

//     const simulationType = Math.floor(Math.random() * 4);

//     switch (simulationType) {
//       // Character swap
//       case 0:
//         if (name.length > 2) {
//           const i = Math.floor(Math.random() * (name.length - 1));
//           suspiciousDomain = `${name.slice(0, i)}${name[i + 1]}${
//             name[i]
//           }${name.slice(i + 2)}.${tld}`;
//         }
//         break;
//       // Character omission
//       case 1:
//         if (name.length > 2) {
//           const i = Math.floor(Math.random() * name.length);
//           suspiciousDomain = `${name.slice(0, i)}${name.slice(i + 1)}.${tld}`;
//         }
//         break;
//       // Different TLD
//       case 2:
//         suspiciousDomain = `${name}.org`;
//         break;
//       // Hyphenation
//       case 3:
//         if (name.length > 4) {
//           const i = Math.floor(name.length / 2);
//           suspiciousDomain = `${name.slice(0, i)}-${name.slice(i)}.${tld}`;
//         }
//         break;
//       default:
//         suspiciousDomain = `${name}-secure.${tld}`;
//     }

//     if (!suspiciousDomain || suspiciousDomain === domain) {
//       suspiciousDomain = `${name}-live.${tld}`; // Fallback
//     }

//     const newThreat: DetectedThreat = {
//       id: `threat-${Date.now()}`,
//       suspiciousDomain,
//       originalDomain: domain,
//       detectedAt: new Date().toLocaleDateString(),
//       risk: Math.random() > 0.3 ? "High" : "Medium",
//     };

//     setDetectedThreats((prev) => {
//       const updatedThreats = [newThreat, ...prev];
//       if (currentSession?.user?.id) {
//         localStorage.setItem(
//           `detectedThreats_${currentSession.user.id}`,
//           JSON.stringify(updatedThreats)
//         );
//       }
//       return updatedThreats;
//     });

//     toast.error(`High-Risk Domain Detected: ${suspiciousDomain}`, {
//       description: `This domain may be impersonating ${domain}.`,
//       icon: <ShieldAlert className="h-5 w-5" />,
//     });
//   };

//   const handleAddDomain = () => {
//     if (newDomain && !monitoredDomains.includes(newDomain)) {
//       const updatedDomains = [...monitoredDomains, newDomain];
//       setMonitoredDomains(updatedDomains);
//       if (currentSession?.user?.id) {
//         localStorage.setItem(
//           `monitoredDomains_${currentSession.user.id}`,
//           JSON.stringify(updatedDomains)
//         );
//       }
//       toast.success(`Started monitoring: ${newDomain}`);
//       // Trigger the one-time scan immediately upon adding
//       simulateThreatDetection(newDomain);
//       setNewDomain("");
//     } else {
//       toast.warning("Domain is either empty or already being monitored.");
//     }
//   };

//   const handleRemoveDomain = (domainToRemove: string) => {
//     const updatedDomains = monitoredDomains.filter((d) => d !== domainToRemove);
//     setMonitoredDomains(updatedDomains);
//     if (currentSession?.user?.id) {
//       localStorage.setItem(
//         `monitoredDomains_${currentSession.user.id}`,
//         JSON.stringify(updatedDomains)
//       );
//     }
//     toast.info(`Stopped monitoring: ${domainToRemove}`);
//   };

//   const handleDismissThreat = (threatId: string) => {
//     const updatedThreats = detectedThreats.filter((t) => t.id !== threatId);
//     setDetectedThreats(updatedThreats);
//     if (currentSession?.user?.id) {
//       localStorage.setItem(
//         `detectedThreats_${currentSession.user.id}`,
//         JSON.stringify(updatedThreats)
//       );
//     }
//   };

//   if (status === "loading" || isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <Loader2 className="h-12 w-12 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-12 ${orbitron.className}`}
//     >
//       <div className="container mx-auto px-4">
//         <AnimatedSection>
//           <div className="text-center mb-12">
//             <Globe className="h-20 w-20 text-blue-600 mx-auto mb-6" />
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
//               Proactive Brand & Domain Monitoring
//             </h1>
//             <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
//               Your personal dashboard for protecting your brand's digital
//               footprint.
//             </p>
//           </div>
//         </AnimatedSection>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
//           {/* Left Column: Domain Management */}
//           <AnimatedSection>
//             <Card className="lg:col-span-1 shadow-xl dark:bg-gray-800/70">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   Monitored Domains
//                   {monitoredDomains.length > 0 && (
//                     <span className="relative flex h-3 w-3">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
//                       <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
//                     </span>
//                   )}
//                 </CardTitle>
//                 <CardDescription>
//                   Add or remove domains you want to protect.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex gap-2 mb-4">
//                   <Input
//                     placeholder="e.g., yourbrand.com"
//                     value={newDomain}
//                     onChange={(e) => setNewDomain(e.target.value)}
//                   />
//                   <Button onClick={handleAddDomain}>
//                     <PlusCircle className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <div className="space-y-2">
//                   {monitoredDomains.length > 0 ? (
//                     monitoredDomains.map((domain) => (
//                       <div
//                         key={domain}
//                         className="flex items-center justify-between rounded-md bg-slate-100 dark:bg-gray-700/50 p-2"
//                       >
//                         <div className="flex items-center gap-2">
//                           <LinkIcon className="h-4 w-4 text-gray-500" />
//                           <span className="font-mono text-sm">{domain}</span>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-6 w-6"
//                           onClick={() => handleRemoveDomain(domain)}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-center text-gray-500 py-4">
//                       No domains are being monitored yet.
//                     </p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </AnimatedSection>

//           {/* Right Column: Threats Dashboard */}
//           <div className="lg:col-span-2">
//             <AnimatedSection>
//               <Card className="shadow-xl dark:bg-gray-800/70">
//                 <CardHeader>
//                   <CardTitle>Detected Threats Dashboard</CardTitle>
//                   <CardDescription>
//                     Live feed of suspicious domains impersonating your brand.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Suspicious Domain</TableHead>
//                         <TableHead>Targeting</TableHead>
//                         <TableHead>Risk</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {isLoading ? (
//                         Array.from({ length: 3 }).map((_, i) => (
//                           <TableRow key={i}>
//                             <TableCell>
//                               <Skeleton className="h-4 w-40" />
//                             </TableCell>
//                             <TableCell>
//                               <Skeleton className="h-4 w-32" />
//                             </TableCell>
//                             <TableCell>
//                               <Skeleton className="h-6 w-16" />
//                             </TableCell>
//                             <TableCell className="text-right">
//                               <Skeleton className="h-8 w-20 ml-auto" />
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : detectedThreats.length > 0 ? (
//                         detectedThreats.map((threat) => (
//                           <TableRow key={threat.id}>
//                             <TableCell className="font-mono">
//                               {threat.suspiciousDomain}
//                             </TableCell>
//                             <TableCell className="font-mono text-xs text-gray-500">
//                               {threat.originalDomain}
//                             </TableCell>
//                             <TableCell>
//                               <Badge variant="destructive">{threat.risk}</Badge>
//                             </TableCell>
//                             <TableCell className="text-right">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleDismissThreat(threat.id)}
//                               >
//                                 <X className="mr-2 h-4 w-4" />
//                                 Dismiss
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell
//                             colSpan={4}
//                             className="h-24 text-center text-gray-500"
//                           >
//                             <ShieldCheck className="mx-auto mb-2 h-8 w-8 text-green-500" />
//                             No threats detected for your domains.
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </CardContent>
//               </Card>
//             </AnimatedSection>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // The final default export wraps the page content with the SessionProvider
// export default function MonitoringPage() {
//   return (
//     <SessionProvider>
//       <MonitoringPageContent />
//     </SessionProvider>
//   );
// }
