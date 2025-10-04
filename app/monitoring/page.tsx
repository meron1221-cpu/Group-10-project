import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CheckCircle,
  ShieldCheck,
  Globe,
  AlertCircle,
  Search,
} from "lucide-react";
import Link from "next/link";

// --- FONT SETUP ---
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function MonitoringPage() {
  const features = [
    "24/7 monitoring for typosquatting and lookalike domains.",
    "Instant alerts via email and SMS when a threat is detected.",
    "Dashboard to track all suspicious domains targeting your brand.",
    "Takedown assistance and reporting services.",
    "Comprehensive brand protection across TLDs and social media.",
  ];

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Protect Brand Reputation",
      description:
        "Safeguard your brand's image and customer trust from malicious actors.",
    },
    {
      icon: AlertCircle,
      title: "Prevent Financial Loss",
      description:
        "Stop phishing attacks and fraud that can lead to significant financial damages.",
    },
    {
      icon: Search,
      title: "Early Threat Detection",
      description:
        "Identify and neutralize threats before they can impact your customers or operations.",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-12 ${orbitron.className}`}
    >
      <div className="container mx-auto px-4 text-center">
        <Globe className="h-20 w-20 text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Proactive Brand & Domain Monitoring
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12">
          Move from reactive defense to proactive protection. GuardSphere
          actively scours the web for domains impersonating your brand, stopping
          scams before they start.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Features Card */}
          <Card className="text-left shadow-xl dark:bg-gray-800/70">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                Key Features
              </CardTitle>
              <CardDescription>
                What our monitoring service offers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Benefits Card */}
          <Card className="text-left shadow-xl dark:bg-gray-800/70">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                Benefits for Your Business
              </CardTitle>
              <CardDescription>
                Why proactive monitoring is essential.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-4">
                  <benefit.icon className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Protect Your Brand?
          </h2>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            <Link href="/#contact">Contact Sales for a Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
