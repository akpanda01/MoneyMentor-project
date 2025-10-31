import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react"

// Stats Data
export const statsData = [
  {
    value: "50K+",
    label: "Active Users",
  },
  {
    value: "$2B+",
    label: "Transactions Tracked",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
]

// Features Data
export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "Advanced Analytics",
    description:
      "Go beyond simple charts. Our AI digs deep into your spending patterns to reveal hidden trends, forecast future expenses, and identify key saving opportunities.",
  },
  {
    icon: <Receipt className="h-8 w-8 text-blue-600" />,
    title: "Smart Receipt Scanner",
    description:
      "Ditch the shoebox of receipts. Just snap a photo, and our AI-powered scanner automatically extracts the vendor, amount, and date, categorizing it instantly.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Budget Planning",
    description:
      "Set up flexible weekly or monthly budgets in seconds. Our smart recommendations help you create realistic goals you can actually stick to, guiding you toward financial freedom.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Multi-Account Support",
    description:
      "Get a complete, unified view of your financial life. Securely connect all your checking, savings, and credit card accounts in one single, easy-to-read dashboard.",
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: "Multi-Currency",
    description:
      "Perfect for travelers or international finances. Track expenses in multiple currencies with real-time conversion rates, so you always know exactly what you're spending.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "Automated Insights",
    description:
      "Receive proactive, personalized financial tips. Our system notifies you of upcoming bills, unusual spending patterns, and opportunities to optimize your cash flow.",
  },
]

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Create Your Account",
    description:
      "Begin your journey to financial clarity in just a few minutes. Our bank-level encrypted sign-up process is simple, fast, and completely secure.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Track Your Spending",
    description:
      "Securely link your bank accounts and credit cards. Money Mentor imports and automatically categorizes your transactions as they happen, giving you a real-time pulse on your spending.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Get Insights",
    description:
      "Watch as the AI analyzes your habits. Receive actionable insights, budget alerts, and personalized recommendations to help you save more and spend smarter.",
  },
]

// Testimonials Data
export const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    quote:
      "Money Mentor has completely transformed how I manage my business finances. The AI insights are incredibly powerful; they helped me identify significant cost-saving opportunities and cash flow patterns I never would have caught on my own.",
  },
  {
    name: "Michael Chen",
    role: "Freelancer",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    quote:
      "As a freelancer, tax time used to be a nightmare. The receipt scanning feature alone saves me hours of tedious data entry every single month. Now I can focus on billable work instead of sorting crumpled receipts.",
  },
  {
    name: "Emily Rodriguez",
    role: "Financial Advisor",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    quote:
      "I confidently recommend Money Mentor to all my clients. It provides the clarity and detailed analytics they need to understand their own habits. The multi-currency support is especially valuable for my clients with international assets.",
  },
]