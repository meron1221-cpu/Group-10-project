"use client";

import {
  Shield,
  Mail,
  AlertTriangle,
  CheckCircle,
  Upload,
  Type,
  Users,
  Send,
  Star,
  Eye,
  BrainCircuit,
  ShieldCheck,
  Linkedin,
  Github,
  Twitter,
  Loader2,
  Sun,
  Moon,
  Languages,
  MessageSquareQuote,
  FileImage,
  Trophy,
  Award,
  LayoutDashboard,
  LogOut,
  LogIn,
  ChevronRight,
  User,
  UserCog,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";
import { Orbitron } from "next/font/google";
import { allBlogPosts } from "@/lib/blog-data";
import { useRouter } from "next/navigation";

// Initialize the font
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// --- i18n & THEME & SCAM REPORT CONTEXT ---

const enTranslations = {
  // Auth
  signIn: "Sign In",
  signOut: "Sign Out",
  dashboard: "Dashboard",
  // New Recent Scams Section
  recentScamsTitle: "Recent Community Reports",
  recentScamsSubtitle:
    "The latest threats reported by the community. Stay informed, stay safe.",
  noRecentScams: "No new scams have been reported recently.",
  beTheFirst: "Be the first to report one!",
  moreScams: "more",
  allRecentScams: "All Recent Scams (Last 48 Hours)",
  // New Scam Report Section
  reportScamTitle: "Report a Scam",
  reportScamSubtitle:
    "Help protect the community by sharing details of a scam you've encountered.",
  scamType: "Type of Scam",
  scamDescription: "Describe the Scam",
  scamScreenshot: "Upload Screenshot (Optional)",
  scamScreenshotHelper: "A picture of the message, email, or website.",
  submitReport: "Submit for Review",
  noFileChosen: "No file chosen",
  // Testimonials
  testimonial1Quote: "GashaSphere is a game-changer. Highly recommended!",
  testimonial1Name: "Sarah L.",
  testimonial1Role: "IT Manager, TechCorp",
  testimonial2Quote: "The peace of mind this tool provides is invaluable.",
  testimonial2Name: "Michael B.",
  testimonial2Role: "Small Business Owner",
  testimonial3Quote:
    "GashaSphere is my first line of defense. Simple, powerful, and effective.",
  testimonial3Name: "Jessica P.",
  testimonial3Role: "Freelance Developer",
  // Team Members
  teamMember1Name: "Aphran Mohammed",
  teamMember1Role: "Lead AI Researcher",
  teamMember1Bio:
    "Architecting the AI models that power our real-time scam detection engine.",
  teamMember2Name: "Nahom Michael",
  teamMember2Role: "Head of Engineering",
  teamMember2Bio:
    "Leading the development of our robust and scalable infrastructure.",
  teamMember3Name: "Dawit Addis",
  teamMember3Role: "Cybersecurity Analyst",
  teamMember3Bio:
    "Analyzing emerging threats and ensuring our defenses are always one step ahead.",
  teamMember4Name: "Meron Nisrane",
  teamMember4Role: "Penetration Tester",
  teamMember4Bio:
    "Proactively finding and fixing vulnerabilities to keep our platform secure.",
  teamMember5Name: "Amanuel",
  teamMember5Role: "Product Manager",
  teamMember5Bio:
    "Defining the vision and roadmap to make cybersecurity accessible to everyone.",
  // Scam Types
  scamTypePhishing: "Phishing",
  scamTypeInvestment: "Investment Fraud",
  scamTypeJob: "Fake Job Offer",
  scamTypeBank: "Bank Impersonation",
  scamTypeLottery: "Lottery Scam",
  scamTypeTech: "Tech Support Scam",
  scamTypeOther: "Other",
  // Existing translations...
  features: "Features",
  aboutUs: "About Us",
  team: "Team",
  contact: "Contact",
  analyzeScam: "Analyze Scam",
  // UPDATED Hero section text
  heroTitleLine1: "Protect Yourself",
  heroTitleLine2: "from Phishing",
  heroTitleLine3: "Attacks",
  heroSubtitle:
    "Our advanced AI-powered system analyzes emails, texts in real-time to detect phishing attempts.",
  analyzeNow: "Analyze Scam Now",
  learnMore: "Learn More",
  ourImpact: "Our Impact",
  impactSubtitle:
    "Our platform's performance, driven by community intelligence.",
  detectionAccuracy: "Target Accuracy", // Corrected Label
  analysisTime: "Analysis Time",
  emailsAnalyzed: "Community Reports", // Corrected Label
  advancedDetection: "Advanced Phishing Detection",
  advancedDetectionSubtitle:
    "Our AI model analyzes multiple indicators to provide comprehensive, real-time protection against phishing attacks.",
  feature1Title: "Suspicious Links",
  feature1Desc:
    "Detects malicious URLs, shortened links, and domain spoofing attempts.",
  feature2Title: "Content Analysis",
  feature2Desc:
    "Analyzes for urgent language, spelling errors, and social engineering tactics.",
  feature3Title: "Header Inspection",
  feature3Desc:
    "Examines email headers for authentication failures and sender reputation.",
  feature4Title: "File Upload",
  feature4Desc: "Support for .eml files and direct email content analysis.",
  feature5Title: "Real-time Results",
  feature5Desc:
    "Get instant analysis with detailed explanations and confidence scores.",
  feature6Title: "Privacy First",
  feature6Desc:
    "Your emails are analyzed securely and never stored on our servers.",
  aboutTitle: "Forging a Safer Digital Frontier",
  aboutSubtitle:
    "At GashaSphere, we're not just building software; we're building trust. Our mission is to democratize cybersecurity and empower everyone to navigate the digital world with confidence.",
  coreValues: "Our Core Values",
  value1Title: "Vigilance",
  value1Desc:
    "We monitor threats to stay ahead of cybercriminals, keeping defenses proactive.",
  value2Title: "Intelligence",
  value2Desc:
    "We leverage AI for accurate detection, turning complex data into clear insights.",
  value3Title: "Accessibility",
  value3Desc:
    "Security should be simple and intuitive, available to everyone regardless of expertise.",
  testimonialsTitle: "What Our Users Say",
  testimonialsSubtitle:
    "We're proud to have earned the trust of professionals worldwide.",
  teamTitle: "Meet Our Team",
  teamSubtitle:
    "The passionate minds dedicated to making Ethiopia safer online.",
  contactTitle: "Get In Touch",
  contactSubtitle:
    "Have questions or want to partner with us? We'd love to hear from you.",
  yourName: "Your Name",
  yourEmail: "Your Email",
  subject: "Subject",
  yourMessage: "Your Message",
  sendMessage: "Send Message",
  sending: "Sending...",
  footerSlogan:
    "Advanced AI-powered phishing detection to keep you safe online.",
  quickLinks: "Quick Links",
  legal: "Legal",
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",
  admin: "Admin",
  stayUpdated: "Stay Updated",
  stayUpdatedDesc: "Get the latest cybersecurity news and product updates.",
  enterEmail: "Enter your email",
  go: "Go",
  copyright: "GashaSphere. All rights reserved.",
  // New for gamification
  guardianPoints: "Guardian Points",
  earnedPoints: "You've earned {points} Guardian Points!",
  // New for Blog
  blogTitle: "Scam of the Week & Resource Center",
  blogSubtitle: "Deep dives into recent threats and how to stay safe.",
  readMore: "Read More",
  // New for B2B Monitoring
  domainMonitoringTitle: "Proactive Brand & Domain Monitoring",
  domainMonitoringSubtitle: "Protect your brand from impersonation.",
  domainMonitoringDesc:
    "Register your official domains and we'll scour the web for lookalike domains (typosquatting), alerting you to potential threats.",
  learnAboutMonitoring: "Learn About Monitoring",
};

const translations: Record<"en" | "am", typeof enTranslations> = {
  en: enTranslations,
  am: {
    // Auth
    signIn: "ግባ",
    signOut: "ውጣ",
    dashboard: "ዳሽቦርድ",
    // New Recent Scams Section
    recentScamsTitle: "የቅርብ ጊዜ የማህበረሰብ ሪፖርቶች",
    recentScamsSubtitle: "በማህበረሰቡ የተዘገቡ የቅርብ ጊዜ ስጋቶች። መረጃ ይኑርዎት፣ ደህንነትዎን ይጠብቁ።",
    noRecentScams: "በቅርብ ጊዜ የተዘገበ አዲስ ማጭበርበር የለም።",
    beTheFirst: "ሪፖርት በማድረግ የመጀመሪያው ይሁኑ!",
    moreScams: "ተጨማሪ",
    allRecentScams: "ሁሉም የቅርብ ጊዜ ማጭበርበሮች (ያለፉት 48 ሰዓታት)",
    // New Scam Report Section
    reportScamTitle: "ማጭበርበርን ሪፖርት አድርግ",
    reportScamSubtitle: "ያጋጠመዎትን የማጭበርበር ዝርዝር በማጋራት ማህበረሰቡን ለመጠበቅ ይረዱ።",
    scamType: "የማጭበርበር አይነት",
    scamDescription: "ማጭበርበሩን ይግለጹ",
    scamScreenshot: "ቅጽበታዊ ገጽ እይታ ስቀል (አማራጭ)",
    scamScreenshotHelper: "የመልዕክቱ፣ የኢሜይሉ ወይም የድረ-ገጹ ምስል።",
    submitReport: "ለግምገማ አስገባ",
    noFileChosen: "ምንም ፋይል አልተመረጠም",
    // Testimonials
    testimonial1Quote: "GashaSphere በጣም አስደናቂ ነው። በጣም ይመከራል!",
    testimonial1Name: "ሣራ ኤል.",
    testimonial1Role: "የ IT ሥራ አስኪያጅ, TechCorp",
    testimonial2Quote: "ይህ መሳሪያ የሚሰጠው የአእምሮ ሰላም ዋጋ የማይተመን ነው።",
    testimonial2Name: "ሚካኤል ቢ.",
    testimonial2Role: "የአነስተኛ ንግድ ባለቤት",
    testimonial3Quote: "GashaSphere የመጀመሪያው የመከላከያ መስመሬ ነው። ቀላል፣ ኃይለኛ እና ውጤታማ።",
    testimonial3Name: "ጄሲካ ፒ.",
    testimonial3Role: "ፍሪላንስ ገንቢ",
    // Team Members
    teamMember1Name: "አፍራን መሐመድ",
    teamMember1Role: "የ AI ምርምር መሪ",
    teamMember1Bio: "የእኛን የእውነተኛ ጊዜ የማጭበርበር መለያ ሞዴሎችን መንደፍ።",
    teamMember2Name: "ናሆም ሚካኤል",
    teamMember2Role: "የምህንድስና ክፍል ኃላፊ",
    teamMember2Bio: "ጠንካራ እና አስተማማኝ መሰረተ ልማታችንን መገንባትን መምራት።",
    teamMember3Name: "ዳዊት አዲስ",
    teamMember3Role: "የሳይበር ደህንነት ተንታኝ",
    teamMember3Bio: "አዳዲስ ስጋቶችን መተንተን እና መከላከያዎቻችን አንድ እርምጃ ቀድመው እንዲገኙ ማድረግ።",
    teamMember4Name: "ሜሮን ንስራኔ",
    teamMember4Role: "የስርዓት ஊடுருவல் ሞካሪ",
    teamMember4Bio: "የስርዓታችንን ደህንነት ለመጠበቅ ተጋላጭነቶችን በንቃት መፈለግ እና ማስተካከል።",
    teamMember5Name: "አማኑኤል",
    teamMember5Role: "የምርት ሥራ አስኪያጅ",
    teamMember5Bio: "የሳይበር ደህንነትን ለሁሉም ተደራሽ ለማድረግ ራዕይን እና ፍኖተ ካርታን መወሰን።",
    // Scam Types
    scamTypePhishing: "ማስገር (Phishing)",
    scamTypeInvestment: "የኢንቨስትመንት ማጭበርበር",
    scamTypeJob: "የውሸት ሥራ ማስታወቂያ",
    scamTypeBank: "የባንክ ስም በመጠቀም ማጭበርበር",
    scamTypeLottery: "የሎተሪ ማጭበርበር",
    scamTypeTech: "የቴክኒክ ድጋፍ ማጭበርበር",
    scamTypeOther: "ሌላ",
    // Existing translations...
    features: "ባህሪያት",
    aboutUs: "ስለ እኛ",
    team: "ቡድን",
    contact: "ግንኙነት",
    analyzeScam: "ማጭበርበርን ተንትን",
    // UPDATED Hero section text (Amharic)
    heroTitleLine1: "እራስዎን ይጠብቁ",
    heroTitleLine2: "ከአስጋሪ",
    heroTitleLine3: "ጥቃቶች",
    heroSubtitle:
      "የኛ የላቀ አርቴፊሻል ኢንተለጀንስ ሲስተም ኢሜይሎችን እና የጽሁፍ መልዕክቶችን በእውነተኛ ጊዜ በመተንተን አስጋሪ ጥቃቶችን ይለያል።",
    analyzeNow: "አሁን ማጭበርበርን ተንትን",
    learnMore: "ተጨማሪ እወቅ",
    ourImpact: "የኛ ተጽዕኖ",
    impactSubtitle: "በእውነተኛ ጊዜ የተረጋገጡ ውጤቶች ያሉት የማጭበርበር መለየት።",
    detectionAccuracy: "የመለየት ትክክለኛነት",
    analysisTime: "የትንተና ጊዜ",
    emailsAnalyzed: "የተተነተኑ ኢሜይሎች",
    advancedDetection: "የላቀ የአስጋሪ ጥቃት መለየት",
    advancedDetectionSubtitle:
      "የኛ AI ሞዴል ሁሉን አቀፍ እና በእውነተኛ ጊዜ ከሚሰነዘሩ ጥቃቶች ለመከላከል በርካታ አመልካቾችን ይመረምራል።",
    feature1Title: "አጠራጣሪ ሊንኮች",
    feature1Desc: "ተንኮል አዘል ዩአርኤሎችን፣ አጫጭር ሊንኮችን እና የዶሜይን ማጭበርበር ሙከራዎችን ያገኛል።",
    feature2Title: "የይዘት ትንተና",
    feature2Desc: "አስቸኳይ ቋንቋን፣ የፊደል ስህተቶችን እና የማህበራዊ ምህንድስና ዘዴዎችን ይመረምራል።",
    feature3Title: "የራስጌ ምርመራ",
    feature3Desc: "የማረጋገጫ ውድቀቶችን እና የላኪን መልካም ስም ለማግኘት የኢሜይል ራስጌዎችን ይመረምራል።",
    feature4Title: "ፋይል ስቀል",
    feature4Desc: "ለ.eml ፋይሎች እና ቀጥተኛ የኢሜይል ይዘት ትንተና ድጋፍ።",
    feature5Title: "የእውነተኛ ጊዜ ውጤቶች",
    feature5Desc: "ዝርዝር ማብራሪያዎችን እና የመተማመን ነጥቦችን የያዘ ፈጣን ትንታኔ ያግኙ።",
    feature6Title: "የግላዊነት ቅድሚያ",
    feature6Desc: "ኢሜይሎችዎ ደህንነቱ በተጠበቀ ሁኔታ ይመረመራሉ እና በአገልጋዮቻችን ላይ በጭራሽ አይቀመጡም።",
    aboutTitle: "ደህንነቱ የተጠበቀ ዲጂታል ድንበር መፍጠር",
    aboutSubtitle:
      "በGashaSphere ላይ ሶፍትዌር ብቻ እየገነባን አይደለም፤ መተማመንን እየገነባን ነው። ተልእኳችን የሳይበር ደህንነትን ለሁሉም ማዳረስ እና ሁሉም ሰው በዲጂታል አለም ውስጥ በልበ ሙሉነት እንዲጓዝ ማስቻል ነው።",
    coreValues: "የእኛ ዋና እሴቶች",
    value1Title: "ንቃት",
    value1Desc: "ከሳይበር ወንጀለኞች ቀድመን ለመቆየት ስጋቶችን እንከታተላለን፣ መከላከያዎችን ንቁ እናደርጋለን።",
    value2Title: "ብልህነት",
    value2Desc:
      "ትክክለኛ መለየትን ለማግኘት AI እንጠቀማለን፣ ውስብስብ መረጃዎችን ወደ ግልጽ ግንዛቤዎች እንለውጣለን።",
    value3Title: "ተደራሽነት",
    value3Desc:
      "ደህንነት ቀላል እና ሊታወቅ የሚችል መሆን አለበት፣ ለሁሉም ሰው ያለ ምንም እውቀት ተደራሽ መሆን አለበት።",
    testimonialsTitle: "የእኛ ተጠቃሚዎች ምን ይላሉ",
    testimonialsSubtitle: "በዓለም ዙሪያ ያሉ ባለሙያዎችን እምነት በማግኘታችን ኩራት ይሰማናል።",
    teamTitle: "ቡድናችንን ያግኙ",
    teamSubtitle: "ኢትዮጵያን በመስመር ላይ ደህንነቱ የተጠበቀ ለማድረግ የቆረጡ አእምሮዎች።",
    contactTitle: "እኛን ያነጋግሩን",
    contactSubtitle: "ጥያቄዎች አሉዎት ወይስ ከእኛ ጋር መስራት ይፈልጋሉ? ከእርስዎ መስማት እንፈልጋለን።",
    yourName: "የእርስዎ ስም",
    yourEmail: "የእርስዎ ኢሜይል",
    subject: "ርዕሰ ጉዳይ",
    yourMessage: "የእርስዎ መልእክት",
    sendMessage: "መልእክት ላክ",
    sending: "እየላከ ነው...",
    footerSlogan: "በመስመር ላይ ደህንነትዎን ለመጠበቅ የላቀ AI-የተጎላበተ የማጭበርበር መለየት።",
    quickLinks: "ፈጣን አገናኞች",
    legal: "ህጋዊ",
    privacyPolicy: "የ ግል የሆነ",
    termsOfService: "የአገልግሎት ውል",
    admin: "አስተዳዳሪ",
    stayUpdated: "መረጃ ያግኙ",
    stayUpdatedDesc: "የቅርብ ጊዜዎቹን የሳይበር ደህንነት ዜናዎች እና የምርት ዝመናዎች ያግኙ።",
    enterEmail: "ኢሜይልዎን ያስገቡ",
    go: "ሂድ",
    copyright: "GashaSphere. ሁሉም መብቶች የተጠበቁ ናቸው።",
    // New for gamification
    guardianPoints: "የጠባቂ ነጥቦች",
    earnedPoints: "{points} የጠባቂ ነጥቦችን አግኝተዋል!",
    // New for Blog
    blogTitle: "የሳምንቱ ማጭበርበር እና የመረጃ ማዕከል",
    blogSubtitle: "የቅርብ ጊዜ ስጋቶች እና እንዴት ደህንነትዎን መጠበቅ እንደሚችሉ ጥልቅ ትንተና።",
    readMore: "ተጨማሪ ያንብቡ",
    // New for B2B Monitoring
    domainMonitoringTitle: "ንቁ የጎራ ክትትል",
    domainMonitoringSubtitle: "ብራንድዎን ከማስመሰል ይጠብቁ።",
    domainMonitoringDesc:
      "ኦፊሴላዊ ጎራዎችዎን ያስመዝግቡ እና እኛም ድሩን ለተመሳሳይ ጎራዎች (typosquatting) እንፈትሻለን፣ ሊሆኑ የሚችሉ ስጋቶችን እናሳውቅዎታለን።",
    learnAboutMonitoring: "ስለ ክትትል ይወቁ",
  },
};

// --- App Context (Theme & Language) ---
type AppContextType = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  language: "en" | "am";
  setLanguage: (language: "en" | "am") => void;
  t: (key: keyof typeof enTranslations) => string;
};

const AppContext = createContext<AppContextType | null>(null);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// --- Recent Scams Context ---
interface ScamReport {
  id: number;
  scamType: string;
  description: string;
  screenshotUrl?: string; // This will now be a base64 string
  timestamp: number;
}

type ScamContextType = {
  approvedScams: ScamReport[];
  addPendingScam: (scam: Omit<ScamReport, "id" | "timestamp">) => void;
};

const ScamContext = createContext<ScamContextType | null>(null);

const useScam = () => {
  const context = useContext(ScamContext);
  if (!context) {
    throw new Error("useScam must be used within a ScamProvider");
  }
  return context;
};

function ScamProvider({ children }: { children: React.ReactNode }) {
  const [approvedScams, setApprovedScams] = useState<ScamReport[]>([]);

  useEffect(() => {
    try {
      const storedScams = localStorage.getItem("approvedScams");
      if (storedScams) {
        const allScams: ScamReport[] = JSON.parse(storedScams);
        const twoDays = 48 * 60 * 60 * 1000;
        const freshScams = allScams.filter(
          (scam) => Date.now() - scam.timestamp < twoDays
        );
        setApprovedScams(freshScams);
      }
    } catch (err) {
      console.error("Failed to load approved scams from localStorage", err);
    }
  }, []);

  const addPendingScam = (scam: Omit<ScamReport, "id" | "timestamp">) => {
    const newScam = { ...scam, id: Date.now(), timestamp: Date.now() };
    try {
      const pending = JSON.parse(localStorage.getItem("pendingScams") || "[]");
      const updatedPending = [newScam, ...pending];
      localStorage.setItem("pendingScams", JSON.stringify(updatedPending));
    } catch (err) {
      console.error("Failed to save pending scam to localStorage", err);
    }
  };

  return (
    <ScamContext.Provider value={{ approvedScams, addPendingScam }}>
      {children}
    </ScamContext.Provider>
  );
}

function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<"en" | "am">("en");

  useEffect(() => {
    const root = window.document.documentElement;
    const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = storedTheme || systemTheme;

    setThemeState(initialTheme);
    root.classList.remove("light", "dark");
    root.classList.add(initialTheme);
  }, []);

  const setTheme = (newTheme: "light" | "dark") => {
    const root = window.document.documentElement;
    root.classList.remove(theme);
    root.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  const t = (key: keyof typeof enTranslations) => {
    return translations[language][key] || translations["en"][key];
  };

  return (
    <SessionProvider>
      <AppContext.Provider
        value={{ theme, setTheme, language, setLanguage, t }}
      >
        <ScamProvider>{children}</ScamProvider>
      </AppContext.Provider>
    </SessionProvider>
  );
}

// --- REUSABLE UTILITY COMPONENTS ---

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
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

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, to, {
        duration: 2,
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toLocaleString();
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to]);

  return <span ref={ref}>0</span>;
}

// --- DECOMPOSED SECTIONAL COMPONENTS ---

function Header() {
  const { t, theme, setTheme, language, setLanguage } = useAppContext();
  const { data: session, status } = useSession();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            GashaSphere
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/#features"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >
            {t("features")}
          </Link>
          <Link
            href="/#about"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >
            {t("aboutUs")}
          </Link>
          <Link
            href="/#team"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >
            {t("team")}
          </Link>
          <Link
            href="/#contact"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >
            {t("contact")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {/* Auth Logic */}
          {status === "loading" ? (
            <div className="h-10 w-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          ) : session ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t("dashboard")}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                aria-label={t("signOut")}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Link href="/auth/signup">
              <Button>{t("signIn")}</Button>
            </Link>
          )}

          {/* Theme and Language Toggles */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            <Languages className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  const { t } = useAppContext();
  return (
    <section className="relative py-16 md:py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900/30 overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto relative grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        {/* Left Column: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight"
            >
              <span>{t("heroTitleLine1")}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                {t("heroTitleLine2")}
              </span>
              <span>{t("heroTitleLine3")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-xl text-gray-600 dark:text-gray-300 font-normal mb-10 leading-relaxed"
            >
              {t("heroSubtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/analyze">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/40"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  {t("analyzeNow")}
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 text-lg transition-transform hover:scale-105 bg-white/70 dark:bg-gray-800/50 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 backdrop-blur-sm border-gray-300 hover:bg-white"
                >
                  {t("learnMore")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column: Animated Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="relative flex items-center justify-center"
        >
          <motion.div
            animate={{
              y: ["0%", "-4%", "0%"],
              rotateY: [0, 15, 0],
              rotateX: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="w-full max-w-md lg:max-w-lg"
          >
            <Image
              src="/hero-cyber-image.jpg"
              alt="Scam Detector Cybersecurity Illustration"
              width={600}
              height={600}
              priority
              className="drop-shadow-2xl rounded-3xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  const { t } = useAppContext();
  const { approvedScams } = useScam();

  const stats = [
    {
      value: 95,
      label: t("detectionAccuracy"),
      suffix: "%+",
      icon: Shield,
      color: "text-blue-400",
    },
    {
      value: 1,
      label: t("analysisTime"),
      prefix: "<",
      suffix: "s",
      icon: Mail,
      color: "text-green-400",
    },
    {
      value: approvedScams.length,
      label: t("emailsAnalyzed"), // This label key now points to "Community Reports"
      suffix: "",
      icon: Users,
      color: "text-purple-400",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              {t("ourImpact")}
            </h2>
            <p className="text-md md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("impactSubtitle")}
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03, y: -3 }}
              className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-md dark:shadow-2xl flex flex-col items-center justify-center transition-all duration-300"
            >
              <div className="mb-3 p-3 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className={`text-4xl font-bold ${stat.color} mb-1`}>
                {stat.prefix}
                <Counter to={stat.value} />
                {stat.suffix}
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DialogScamCard({ scam }: { scam: ScamReport }) {
  return (
    <div className="flex items-start gap-4 p-4 border-b dark:border-gray-700">
      {scam.screenshotUrl && (
        <Image
          src={scam.screenshotUrl}
          alt="Scam screenshot"
          width={100}
          height={100}
          className="rounded-md border dark:border-gray-600 object-cover"
        />
      )}
      <div className="flex-1">
        <Badge variant="destructive">{scam.scamType}</Badge>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {scam.description}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {new Date(scam.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function ScamCard({ scam }: { scam: ScamReport }) {
  return (
    <Link href={`/analysis/${scam.id}`} passHref>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-blue-500 transition-all duration-300 dark:bg-gray-800/50 cursor-pointer">
          {scam.screenshotUrl && (
            <div className="relative w-full h-40">
              <Image
                src={scam.screenshotUrl}
                alt="Scam screenshot"
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
          <CardHeader>
            <Badge variant="destructive" className="w-fit">
              {scam.scamType}
            </Badge>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
              {scam.description}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

function MoreScamsCard({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  const { t } = useAppContext();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-full"
    >
      <Card
        onClick={onClick}
        className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed hover:border-solid hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50 dark:bg-gray-800/30 cursor-pointer transition-all duration-300"
      >
        <CardTitle className="text-4xl font-bold text-blue-500 dark:text-blue-400">
          +{count}
        </CardTitle>
        <CardDescription>{t("moreScams")}</CardDescription>
      </Card>
    </motion.div>
  );
}

function RecentScamsSection() {
  const { t } = useAppContext();
  const { approvedScams } = useScam();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const scamTypes = [
    "Phishing",
    "Investment Fraud",
    "Fake Job Offer",
    "Bank Impersonation",
    "Lottery Scam",
    "Tech Support Scam",
    "Other",
  ];

  const filteredScams = approvedScams.filter(
    (scam) => filter === "all" || scam.scamType === filter
  );
  const displayScams = filteredScams.slice(0, 3);
  const remainingCount =
    filteredScams.length > 3 ? filteredScams.length - 2 : 0;

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-blue-500 dark:text-blue-400">
              {t("recentScamsTitle")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t("recentScamsSubtitle")}
            </p>
          </div>
          <div className="flex justify-center mb-12">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Filter by type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {scamTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredScams.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                {t("noRecentScams")}
              </p>
              <p className="font-semibold text-blue-500 dark:text-blue-400 mt-2">
                {t("beTheFirst")}
              </p>
            </div>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayScams.map((scam, index) => {
                  if (index === 2 && filteredScams.length > 3) {
                    return (
                      <DialogTrigger asChild key="more-trigger">
                        <MoreScamsCard
                          count={remainingCount}
                          onClick={() => setIsDialogOpen(true)}
                        />
                      </DialogTrigger>
                    );
                  }
                  return <ScamCard key={scam.id} scam={scam} />;
                })}
              </div>
              <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>{t("allRecentScams")}</DialogTitle>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto">
                  {filteredScams.map((scam) => (
                    <DialogScamCard key={scam.id} scam={scam} />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { t } = useAppContext();
  const features = [
    {
      icon: AlertTriangle,
      title: t("feature1Title"),
      description: t("feature1Desc"),
    },
    { icon: Type, title: t("feature2Title"), description: t("feature2Desc") },
    { icon: Mail, title: t("feature3Title"), description: t("feature3Desc") },
    { icon: Upload, title: t("feature4Title"), description: t("feature4Desc") },
    {
      icon: CheckCircle,
      title: t("feature5Title"),
      description: t("feature5Desc"),
    },
    { icon: Shield, title: t("feature6Title"), description: t("feature6Desc") },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-slate-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              {t("advancedDetection")}
            </h2>
            <p className="text-md md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("advancedDetectionSubtitle")}
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <AnimatedSection key={index}>
              <motion.div whileHover={{ y: -6, scale: 1.03 }}>
                <Card className="h-full text-center shadow-md hover:shadow-xl dark:bg-gray-800/50 dark:border-gray-700 transition-shadow duration-300 border-t-4 border-transparent hover:border-blue-500 rounded-lg">
                  <CardHeader className="items-center p-6">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4 inline-flex justify-center items-center">
                      <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg md:text-xl font-semibold mb-1">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base text-gray-600 dark:text-gray-400">
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
  );
}

function AboutSection() {
  const { t } = useAppContext();
  const values = [
    { icon: Eye, title: t("value1Title"), description: t("value1Desc") },
    {
      icon: BrainCircuit,
      title: t("value2Title"),
      description: t("value2Desc"),
    },
    {
      icon: ShieldCheck,
      title: t("value3Title"),
      description: t("value3Desc"),
    },
  ];

  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-white dark:bg-gray-900 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml,<svg_width=%2220%22_height=%2220%22_viewBox=%220_0_20_20%22_xmlns=%22http://www.w3.org/2000/svg%22><circle_fill=%22%23e2e8f0%22_cx=%2210%22_cy=%2210%22_r=%221%22/></svg>')] opacity-30 dark:opacity-5"
        style={{ backgroundRepeat: "repeat" }}
      ></div>
      <div className="container mx-auto px-4 relative">
        <AnimatedSection>
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-extrabold text-blue-500 dark:text-blue-400 mb-4 tracking-tight">
              {t("aboutTitle")}
            </h2>
            <p className="text-md md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t("aboutSubtitle")}
            </p>
          </div>
        </AnimatedSection>
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
          <AnimatedSection className="relative h-80 lg:h-auto mb-12 lg:mb-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl shadow-2xl transform -rotate-2"></div>
            <motion.div
              className="relative h-full w-full p-6 flex items-center justify-center rounded-2xl bg-gray-900/20 backdrop-blur-lg border border-white/10"
              animate={{
                y: ["0%", "-3%", "0%"],
                scale: [1, 1.02, 1],
                rotate: [-1, 1, -1],
              }}
              transition={{
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              whileTap={{ scale: 0.95, rotate: 5 }}
            >
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
            </motion.div>
          </AnimatedSection>
          <AnimatedSection className="relative">
            <div className="bg-white/90 dark:bg-gray-800/70 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8">
                {t("coreValues")}
              </h3>
              <ul className="space-y-6 md:space-y-8">
                {values.map((value, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-5 flex-shrink-0 ring-4 ring-blue-50 dark:ring-blue-900/20">
                      <value.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-semibold">
                        {value.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
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
  );
}

function TestimonialsSection() {
  const { t } = useAppContext();
  const testimonials = [
    {
      quote: t("testimonial1Quote"),
      name: t("testimonial1Name"),
      role: t("testimonial1Role"),
    },
    {
      quote: t("testimonial2Quote"),
      name: t("testimonial2Name"),
      role: t("testimonial2Role"),
    },
    {
      quote: t("testimonial3Quote"),
      name: t("testimonial3Name"),
      role: t("testimonial3Role"),
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-br from-white to-slate-100 dark:from-gray-900 dark:to-gray-800/50 relative"
    >
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-blue-500 dark:text-blue-400">
              {t("testimonialsTitle")}
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-1 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t("testimonialsSubtitle")}
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={index}>
              <motion.div
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col justify-between shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-transform hover:scale-105 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm min-h-[280px]">
                  {/* Adjusted padding on CardContent */}
                  <CardContent className="p-6 flex-1">
                    <div className="flex space-x-1 text-yellow-400 mb-4 drop-shadow-md">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} fill="currentColor" />
                      ))}
                    </div>
                    <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                  </CardContent>
                  {/* Adjusted padding on CardHeader */}
                  <CardHeader className="pt-2 px-6">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
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
  );
}

function ReportScamSection() {
  const { t } = useAppContext();
  const { addPendingScam } = useScam();
  const [scamType, setScamType] = useState("Phishing");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scamTypes = [
    { value: "Phishing", labelKey: "scamTypePhishing" },
    { value: "Investment Fraud", labelKey: "scamTypeInvestment" },
    { value: "Fake Job Offer", labelKey: "scamTypeJob" },
    { value: "Bank Impersonation", labelKey: "scamTypeBank" },
    { value: "Lottery Scam", labelKey: "scamTypeLottery" },
    { value: "Tech Support Scam", labelKey: "scamTypeTech" },
    { value: "Other", labelKey: "scamTypeOther" },
  ];

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Please upload an image under 5MB.");
        return;
      }
      setScreenshot(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please provide a description for the scam.");
      return;
    }
    setIsSubmitting(true);

    let screenshotUrl: string | undefined = undefined;
    if (screenshot) {
      try {
        screenshotUrl = await fileToBase64(screenshot);
      } catch (error) {
        console.error("Error converting file to base64", error);
        toast.error("Could not process the image. Please try another one.");
        setIsSubmitting(false);
        return;
      }
    }

    addPendingScam({ scamType, description, screenshotUrl });

    toast.success("Thank you! Your report has been submitted for review.", {
      description: "You've earned 10 Guardian Points for your contribution!",
      icon: <Award className="h-5 w-5 text-yellow-500" />,
    });

    setDescription("");
    setScamType("Phishing");
    setScreenshot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsSubmitting(false);
  };

  return (
    <section
      id="report-scam"
      className="py-24 bg-slate-100 dark:bg-gray-900/50"
    >
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <Card className="dark:bg-gray-800/50 dark:border-gray-700 p-8 shadow-lg rounded-2xl">
              <CardHeader className="text-center p-0 mb-8">
                <CardTitle className="text-3xl md:text-4xl font-bold">
                  {t("reportScamTitle")}
                </CardTitle>
                <CardDescription className="text-lg">
                  {t("reportScamSubtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="scamType">{t("scamType")}</Label>
                      <Select value={scamType} onValueChange={setScamType}>
                        <SelectTrigger
                          id="scamType"
                          className={orbitron.className}
                        >
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {scamTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {t(type.labelKey as keyof typeof translations.en)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="screenshot">{t("scamScreenshot")}</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FileImage className="mr-2 h-4 w-4" />
                          Choose File
                        </Button>
                        <span className="text-sm text-gray-500 truncate">
                          {screenshot?.name || t("noFileChosen")}
                        </span>
                      </div>
                      <Input
                        id="screenshot"
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/gif"
                      />
                      <p className="text-xs text-gray-500">
                        {t("scamScreenshotHelper")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t("scamDescription")}</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., 'Received a text from +251... saying I won a prize and needed to click a link...'"
                      rows={5}
                      required
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <MessageSquareQuote className="mr-2 h-4 w-4" />
                      )}
                      {isSubmitting ? t("sending") : t("submitReport")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

const BlogPostSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[200px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

function ResourceCenterSection() {
  const { t } = useAppContext();
  const { approvedScams } = useScam();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get the current week number of the year
  const getWeekNumber = (d: Date): number => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
    return weekNo;
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      // 1. Determine Scam of the Week from local, recent reports
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recentUserScams = approvedScams.filter(
        (scam) => scam.timestamp > oneWeekAgo
      );

      let scamOfTheWeek: any;

      if (recentUserScams.length > 0) {
        // Find the most reported scam type in the last week
        const typeCounts = recentUserScams.reduce((acc, report) => {
          acc[report.scamType] = (acc[report.scamType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const topScamType = Object.entries(typeCounts).sort(
          (a, b) => b[1] - a[1]
        )[0][0];

        // Find a blog post that matches this type
        scamOfTheWeek =
          allBlogPosts.find((post) => post.type === topScamType) ||
          allBlogPosts[0]; // Fallback
        scamOfTheWeek.title = `Community Alert: ${scamOfTheWeek.title}`;
      } else {
        // 2. Fallback to weekly rotation if no recent user reports
        const currentWeek = getWeekNumber(new Date());
        const weeklyIndex = currentWeek % allBlogPosts.length;
        scamOfTheWeek = allBlogPosts[weeklyIndex];
        scamOfTheWeek.title = `Scam of the Week: ${scamOfTheWeek.title}`;
      }

      // 3. Get other random posts for the resource center
      const otherPosts = allBlogPosts
        .filter((post) => post.id !== scamOfTheWeek.id)
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, 2); // Take the first two

      setPosts([scamOfTheWeek, ...otherPosts]);
      setIsLoading(false);
    }, 1500); // Simulate network delay
  }, [approvedScams]); // Re-run when approved scams change

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-blue-500 dark:text-blue-400">
              {t("blogTitle")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t("blogSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <BlogPostSkeleton key={index} />
                ))
              : posts.map((post) => (
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
                          <CardTitle className="text-xl">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                            {post.excerpt}
                          </p>
                        </CardContent>
                        <div className="p-6 pt-0">
                          <Button variant="link" className="p-0">
                            {t("readMore")}{" "}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  </Link>
                ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function DomainMonitoringSection() {
  const { t } = useAppContext();
  return (
    <section
      className={`py-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 ${orbitron.className}`}
    >
      <div className="container mx-auto px-4 text-center">
        <AnimatedSection>
          <Card className="max-w-4xl mx-auto p-8 shadow-xl dark:bg-gray-900">
            <CardHeader>
              <ShieldCheck className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-3xl font-bold mb-2">
                {t("domainMonitoringTitle")}
              </CardTitle>
              <CardDescription className="text-lg">
                {t("domainMonitoringSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {t("domainMonitoringDesc")}
              </p>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/monitoring">{t("learnAboutMonitoring")}</Link>
              </Button>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
}

function TeamSection() {
  const { t } = useAppContext();
  const teamMembers = [
    {
      name: t("teamMember1Name"),
      role: t("teamMember1Role"),
      bio: t("teamMember1Bio"),
      gender: "male",
      expertise: ["AI/ML", "NLP"],
      social: {
        linkedin: "#",
        github: "https://github.com/Aphranm",
      },
    },
    {
      name: t("teamMember2Name"),
      role: t("teamMember2Role"),
      bio: t("teamMember2Bio"),
      gender: "male",
      expertise: ["Backend", "penetration tester"],
      social: {
        linkedin: "#",
        github: "https://github.com/Nahoo-Man",
      },
    },
    {
      name: t("teamMember3Name"),
      role: t("teamMember3Role"),
      bio: t("teamMember3Bio"),
      gender: "male",
      expertise: ["Threat Analysis", "SOC"],
      social: {
        linkedin: "#",
        github: "https://github.com/dave-zed",
      },
    },
    {
      name: t("teamMember4Name"),
      role: t("teamMember4Role"),
      bio: t("teamMember4Bio"),
      gender: "female",
      image: "/my.PNG",
      expertise: ["Ethical Hacking", "Security Audits"],
      social: {
        linkedin: "https://et.linkedin.com/in/meron-nisrane-1882b629b",
        github: "https://github.com/meron1221-cpu",
      },
    },
    {
      name: t("teamMember5Name"),
      role: t("teamMember5Role"),
      bio: t("teamMember5Bio"),
      gender: "male",
      expertise: ["Product", "UX/UI"],
      social: {
        linkedin: "https://et.linkedin.com/in/amanuel-mihrte-91a81537b",
        github: "#",
      },
    },
  ];

  return (
    <section
      id="team"
      className="py-24 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800/30 relative"
    >
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-blue-500 dark:text-blue-400">
              {t("teamTitle")}
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-1 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t("teamSubtitle")}
            </p>
          </div>
        </AnimatedSection>
        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member: any, index) => (
            <AnimatedSection key={index} className="w-full sm:w-2/5 lg:w-[30%]">
              <motion.div
                className="h-full"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full flex flex-col text-center bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 group transition-all duration-300 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500">
                  <div className="relative mb-4 self-center">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={100}
                        height={100}
                        className="rounded-full object-cover w-28 h-28 border-4 border-white dark:border-gray-800 shadow-lg"
                      />
                    ) : (
                      <motion.div
                        className="text-7xl mb-4"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 3,
                          ease: "easeInOut",
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      >
                        {member.gender === "female" ? "👩‍💻" : "👨‍💻"}
                      </motion.div>
                    )}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                    {member.role}
                  </CardDescription>
                  <CardContent className="p-0 mt-4 flex-grow">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {member.bio}
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {member.expertise.map((skill: string) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <div className="mt-6 flex justify-center gap-4 text-gray-400">
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Linkedin size={20} />
                    </a>
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-900 dark:hover:text-white"
                    >
                      <Github size={20} />
                    </a>
                  </div>
                </Card>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { t } = useAppContext();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (!response.ok) throw new Error("Server responded with an error.");
      toast.success("Message Sent!", {
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to Send Message", {
        description: "Please try again later or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 bg-slate-50 dark:bg-gray-900 relative overflow-hidden"
    >
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="container mx-auto px-4 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-500 dark:text-blue-400 mb-4 tracking-tight">
              {t("contactTitle")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t("contactSubtitle")}
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
              <Card className="shadow-2xl rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-3xl transition-shadow duration-500">
                <CardContent className="p-8 bg-white/90 dark:bg-gray-800/50 backdrop-blur-md">
                  <div className="space-y-6">
                    <div className="relative group">
                      <Input
                        id="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="peer bg-transparent border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-4 w-full"
                        required
                      />
                      <label
                        htmlFor="name"
                        className="absolute left-4 top-4 text-gray-500 dark:text-gray-400 transition-all duration-300 transform origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-blue-600 dark:peer-focus:text-blue-400 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3.5"
                      >
                        {t("yourName")}
                      </label>
                    </div>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="peer bg-transparent border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-4 w-full"
                        required
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-4 top-4 text-gray-500 dark:text-gray-400 transition-all duration-300 transform origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-blue-600 dark:peer-focus:text-blue-400 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3.5"
                      >
                        {t("yourEmail")}
                      </label>
                    </div>
                    <div className="relative group">
                      <Input
                        id="subject"
                        value={formState.subject}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="peer bg-transparent border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-4 w-full"
                        required
                      />
                      <label
                        htmlFor="subject"
                        className="absolute left-4 top-4 text-gray-500 dark:text-gray-400 transition-all duration-300 transform origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-blue-600 dark:peer-focus:text-blue-400 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3.5"
                      >
                        {t("subject")}
                      </label>
                    </div>
                    <div className="relative group">
                      <Textarea
                        id="message"
                        rows={5}
                        value={formState.message}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="peer bg-transparent border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-4 w-full resize-none"
                        required
                      />
                      <label
                        htmlFor="message"
                        className="absolute left-4 top-4 text-gray-500 dark:text-gray-400 transition-all duration-300 transform origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-blue-600 dark:peer-focus:text-blue-400 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3.5"
                      >
                        {t("yourMessage")}
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-center mt-8">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-auto px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 rounded-lg shadow-md hover:shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {isSubmitting ? t("sending") : t("sendMessage")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useAppContext();
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">GashaSphere</span>
            </div>
            <p className="text-gray-400">{t("footerSlogan")}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  {t("features")}
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-white transition-colors"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="#team"
                  className="hover:text-white transition-colors"
                >
                  {t("team")}
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
              {/* New Quick Links */}
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  {t("blogTitle")}
                </Link>
              </li>
              <li>
                <Link
                  href="/monitoring"
                  className="hover:text-white transition-colors"
                >
                  {t("domainMonitoringTitle")}
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="hover:text-white transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{t("legal")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t("termsOfService")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{t("stayUpdated")}</h3>
            <p className="text-gray-400 mb-4">{t("stayUpdatedDesc")}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Subscribed!", {
                  description: "You're now on our mailing list.",
                });
              }}
            >
              <div className="flex">
                <Input
                  type="email"
                  placeholder={t("enterEmail")}
                  className="bg-gray-800 border-gray-700 rounded-r-none text-white"
                  required
                />
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 rounded-l-none"
                >
                  {t("go")}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- MAIN PAGE COMPONENT ---

function HomePageContent() {
  const router = useRouter();

  useEffect(() => {
    const handleSecretShortcut = (e: KeyboardEvent) => {
      // Secret combo: Ctrl + Alt + A
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        router.push("/admin/login");
      }
    };

    window.addEventListener("keydown", handleSecretShortcut);
    return () => window.removeEventListener("keydown", handleSecretShortcut);
  }, [router]);

  return (
    <div
      className={`min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-300 transition-colors duration-300 ${orbitron.className}`}
    >
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <RecentScamsSection />
        <FeaturesSection />
        <AboutSection />
        <TestimonialsSection />
        <ReportScamSection />
        <ResourceCenterSection />
        <DomainMonitoringSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <AppProvider>
      <HomePageContent />
    </AppProvider>
  );
}
