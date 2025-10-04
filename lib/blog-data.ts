export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  type: string;
  excerpt: string;
  image: string;
  fullContent: string[];
  link: string; // Added this line
}

export const allBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Rise of Deepfake Voice Scams",
    slug: "deepfake-voice-scams",
    type: "AI Scam",
    excerpt:
      "Learn how AI is being used to mimic voices and how to protect yourself from sophisticated deepfake scams.",
    link: "/blog/deepfake-voice-scams",
    image:
      "https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=1932&auto=format&fit=crop",
    fullContent: [
      "Artificial intelligence has reached a point where it can convincingly replicate a person's voice from just a few seconds of audio. Scammers are exploiting this technology to create 'deepfake' voice clones of family members or colleagues.",
      "The scam typically involves receiving a frantic phone call from a number you don't recognize. The voice on the other end sounds exactly like a loved one, claiming they are in trouble and need money wired immediately for bail, a medical emergency, or a kidnapping ransom. The emotional distress and familiarity of the voice are designed to make you act before you can think.",
      "To protect yourself, always be skeptical of urgent, high-pressure requests for money, even if the voice sounds familiar. Hang up and call the person back on their known, trusted phone number to verify the situation. Agree on a secret 'safe word' with your family that only you would know, which can be used to confirm identity in a real emergency.",
    ],
  },
  {
    id: 2,
    title: "Anatomy of an Ethio Telecom Impersonation Scam",
    slug: "ethio-telecom-impersonation",
    type: "Bank Impersonation", // Can be re-categorized if needed
    excerpt:
      "We break down a recent SMS scam targeting mobile users in Ethiopia, detailing its tactics and how GuardSphere detects it.",
    link: "/blog/ethio-telecom-impersonation",
    image:
      "https://images.unsplash.com/photo-1614098512324-a874799c9c74?q=80&w=1740&auto=format&fit=crop",
    fullContent: [
      "A widespread SMS campaign is targeting Ethio Telecom users with messages claiming their SIM card will be blocked unless they perform an 'upgrade.' The message contains a link that leads to a fake website designed to look like an official Ethio Telecom portal.",
      "Once on the site, users are asked to enter their phone number and a One-Time Password (OTP) that is sent to their device. By providing this OTP, victims unknowingly grant scammers access to their mobile money accounts (like Telebirr) or authorize fraudulent SIM swaps, giving criminals control over their phone number.",
      "Ethio Telecom will never ask for your PIN or OTP via a link in an SMS. Never enter sensitive information on a website you accessed from an unsolicited message. If you have any doubts, visit an official Ethio Telecom service center in person or call their official customer service number.",
    ],
  },
  {
    id: 3,
    title: "The 'Urgent Package Delivery' SMS Trap",
    slug: "package-delivery-scam",
    type: "Phishing",
    excerpt:
      "A look at the persistent SMS scam that tricks you into giving away personal information for a non-existent package.",
    link: "/blog/package-delivery-scam",
    image:
      "https://images.unsplash.com/photo-1587145820137-a9dbc8c54933?q=80&w=1740&auto=format&fit=crop",
    fullContent: [
      "This common scam involves receiving a text message about a pending package delivery. The message often claims there's an issue with the shipping address or a small customs fee is due, and it includes a link to 'resolve' the problem.",
      "The link directs to a convincing but fake courier website (impersonating brands like DHL, FedEx, or the local post office). The site will then ask for your personal information, such as your full name, address, and credit card details to pay the 'fee.'",
      "The goal is to steal your financial information. Legitimate delivery companies will not ask for payment details via a text message link. Always track your packages using the official website or app of the courier, and never click on unsolicited tracking links.",
    ],
  },
  {
    id: 4,
    title: "Understanding Phishing: The Basics",
    slug: "understanding-phishing",
    type: "Phishing",
    excerpt:
      "A foundational guide to identifying and avoiding common phishing attacks, from email to social media.",
    link: "/blog/understanding-phishing",
    image:
      "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=1740&auto=format&fit=crop",
    fullContent: [
      "Phishing is a type of cyber-attack where criminals impersonate legitimate organizations via email, text message, or other electronic communication to trick you into providing sensitive information such as passwords, credit card numbers, or personal identifiers.",
      "Key red flags include a sense of urgency, unexpected attachments or links, generic greetings like 'Dear Customer,' and slight variations in email addresses or domain names. For example, an email from 'support@yourbank.co' instead of 'support@yourbank.com' is a major warning sign.",
      "The best defense is a healthy dose of skepticism. Verify requests through a separate, trusted channel. Hover over links to see the actual destination URL before clicking. And most importantly, never give out sensitive information in response to an unsolicited request.",
    ],
  },
  {
    id: 5,
    title: "Investment Scams: Spotting 'Too Good to Be True' Offers",
    slug: "investment-scams",
    type: "Investment Fraud",
    excerpt:
      "From crypto pumps to pyramid schemes, learn the red flags of modern investment fraud.",
    link: "/blog/investment-scams",
    image:
      "https://images.unsplash.com/photo-1621313499145-2a44efd1b3d2?q=80&w=1740&auto=format&fit=crop",
    fullContent: [
      "Investment scams promise high returns with little to no risk, preying on the desire for quick financial gain. These often appear on social media platforms, promoted by fake accounts or even compromised accounts of people you know.",
      "Common tactics include 'guaranteed' profits, pressure to 'act now before the opportunity is gone,' and requests to invest using cryptocurrency to make transactions irreversible. They may use sophisticated-looking charts and fake testimonials to build a facade of legitimacy.",
      "Remember that all legitimate investments carry risk, and none can guarantee a profit. Be wary of anyone who contacts you with unsolicited investment advice. Research any investment opportunity thoroughly and consult with a licensed financial advisor before sending any money.",
    ],
  },
];
