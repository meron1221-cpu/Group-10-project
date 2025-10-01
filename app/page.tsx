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
  Loader2,
  Sun,
  Moon,
  Languages,
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
import { useEffect, useRef, useState, createContext, useContext } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// --- i18n & THEME CONTEXT ---

const translations = {
  en: {
    features: "Features",
    aboutUs: "About Us",
    team: "Team",
    contact: "Contact",
    analyzeScam: "Analyze Scam",
    heroTitle: "Protect Yourself from",
    heroTitleSpan: "Phishing Attacks",
    heroSubtitle:
      "Our advanced AI-powered system analyzes emails in real-time to detect phishing attempts, keeping you safe from cybercriminals and protecting your sensitive information.",
    analyzeNow: "Analyze Scam Now",
    learnMore: "Learn More",
    ourImpact: "Our Impact",
    impactSubtitle: "Real-time phishing detection with proven results.",
    detectionAccuracy: "Detection Accuracy",
    analysisTime: "Analysis Time",
    emailsAnalyzed: "Emails Analyzed",
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
      "At GuardSphere, we're not just building software; we're building trust. Our mission is to democratize cybersecurity and empower everyone to navigate the digital world with confidence.",
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
    copyright: "GuardSphere. All rights reserved.",
  },
  am: {
    features: "ባህሪያት",
    aboutUs: "ስለ እኛ",
    team: "ቡድን",
    contact: "ግንኙነት",
    analyzeScam: "ማጭበርበርን ተንትን",
    heroTitle: "እራስዎን ከ",
    heroTitleSpan: "አስጋሪ ጥቃቶች ይጠብቁ",
    heroSubtitle:
      "የኛ የላቀ አርቴፊሻል ኢንተለጀንስ ሲስተም ኢሜይሎችን በእውነተኛ ጊዜ በመተንተን አስጋሪ ጥቃቶችን በመለየት ከሳይበር ወንጀለኞች ይጠብቅዎታል እንዲሁም ሚስጥራዊ መረጃዎን ይጠብቃል።",
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
      "በGuardSphere ላይ ሶፍትዌር ብቻ እየገነባን አይደለም፤ መተማመንን እየገነባን ነው። ተልእኳችን የሳይበር ደህንነትን ለሁሉም ማዳረስ እና ሁሉም ሰው በዲጂታል አለም ውስጥ በልበ ሙሉነት እንዲጓዝ ማስቻል ነው።",
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
    copyright: "GuardSphere. ሁሉም መብቶች የተጠበቁ ናቸው።",
  },
};

type AppContextType = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  language: "en" | "am";
  setLanguage: (language: "en" | "am") => void;
  t: (key: keyof (typeof translations)["en"]) => string;
};

const AppContext = createContext<AppContextType | null>(null);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

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

  const t = (key: keyof (typeof translations)["en"]) => {
    return translations[language][key] || translations["en"][key];
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage, t }}>
      {children}
    </AppContext.Provider>
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

// --- DECOMPOSED SECTIONAL COMPONENTS ---

function Header() {
  const { t, theme, setTheme, language, setLanguage } = useAppContext();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            GuardSphere
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#features"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >
            {t("features")}
          </Link>
          <Link
            href="#about"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >
            {t("aboutUs")}
          </Link>
          <Link
            href="#team"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >
            {t("team")}
          </Link>
          <Link
            href="#contact"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >
            {t("contact")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/analyze">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-shadow">
              {t("analyzeScam")}
            </Button>
          </Link>
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
    <section className="relative font-sans py-24 md:py-32 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900/30 overflow-hidden">
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
              className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight"
            >
              {t("heroTitle")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                {t("heroTitleSpan")}
              </span>
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
              className="flex flex-col sm:flex-row gap-4 justify-center"
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
      </div>
    </section>
  );
}

function StatsSection() {
  const { t } = useAppContext();
  const stats = [
    {
      value: 99.7,
      label: t("detectionAccuracy"),
      suffix: "%",
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
      value: 1000000,
      label: t("emailsAnalyzed"),
      suffix: "+",
      icon: Users,
      color: "text-purple-400",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/30 dark:to-gray-900/50">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t("ourImpact")}
            </h2>
            <p className="text-md md:text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
              {t("impactSubtitle")}
            </p>
          </div>
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
                <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
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
            <p className="text-md md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("aboutSubtitle")}
            </p>
          </div>
        </AnimatedSection>
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
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
                <Card className="h-full flex flex-col justify-between shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-transform hover:scale-105 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm min-h-[320px]">
                  <CardContent className="pt-6 px-6 flex-1">
                    <div className="flex space-x-1 text-yellow-400 mb-4 drop-shadow-md">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} fill="currentColor" />
                      ))}
                    </div>
                    <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                  </CardContent>
                  <CardHeader className="pt-4 px-6">
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

function TeamSection() {
  const { t } = useAppContext();
  const teamMembers = [
    {
      name: "Aphran Mohammed",
      role: "Lead AI Researcher",
      bio: "Architecting the AI models that power our real-time scam detection engine.",
      gender: "male",
      expertise: ["AI/ML", "NLP"],
      social: { linkedin: "#", github: "#" },
    },
    {
      name: "Nahom Michael",
      role: "Head of Engineering",
      bio: "Leading the development of our robust and scalable infrastructure.",
      gender: "male",
      expertise: ["Backend", "penetration tester"],
      social: { linkedin: "#", github: "#" },
    },
    {
      name: "Dawit Addis",
      role: "Cybersecurity Analyst",
      bio: "Analyzing emerging threats and ensuring our defenses are always one step ahead.",
      gender: "male",
      expertise: ["Threat Analysis", "SOC"],
      social: { linkedin: "#", github: "#" },
    },
    {
      name: "Meron Nisrane",
      role: "Penetration Tester",
      bio: "Proactively finding and fixing vulnerabilities to keep our platform secure.",
      gender: "female",
      expertise: ["Ethical Hacking", "Security Audits"],
      social: {
        linkedin: "#www.linkedin.com/in/meron-nisrane-1882b629b",
        github: "https://github.com/meron1221-cpu",
      },
    },
    {
      name: "Amanuel",
      role: "Product Manager",
      bio: "Defining the vision and roadmap to make cybersecurity accessible to everyone.",
      gender: "male",
      expertise: ["Product", "UX/UI"],
      social: { linkedin: "#", github: "#" },
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
          {teamMembers.map((member, index) => (
            <AnimatedSection key={index} className="w-full sm:w-2/5 lg:w-[30%]">
              <motion.div
                className="h-full"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full flex flex-col text-center bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 group transition-all duration-300 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500">
                  <div className="relative mb-4 self-center">
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
                      {member.expertise.map((skill) => (
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
              <span className="text-xl font-bold">GuardSphere</span>
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
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors text-xs opacity-60"
                >
                  {t("admin")}
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
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}

// --- MAIN PAGE COMPONENT ---

function HomePageContent() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-300 transition-colors duration-300">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <AboutSection />
        <TestimonialsSection />
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
