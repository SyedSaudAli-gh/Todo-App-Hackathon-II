export const LANDING_CONTENT = {
  navbar: {
    appName: "Todos",
    signInText: "Sign In",
    signUpText: "Sign Up"
  },
  hero: {
    headline: "Organize Your Work, Amplify Your Productivity",
    subheading: "Smart todo management with personalized settings that adapt to your workflow. Stay focused on what matters.",
    primaryCTA: "Get Started",
    secondaryCTA: "View Demo"
  },
  showcase: {
    title: "See It In Action",
    demoTodos: [
      { id: 1, title: "Launch product feature", priority: "high", completed: false },
      { id: 2, title: "Review team proposals", priority: "medium", completed: false },
      { id: 3, title: "Update documentation", priority: "low", completed: false },
      { id: 4, title: "Prepare presentation", priority: "medium", completed: true },
      { id: 5, title: "Send weekly report", priority: "low", completed: true }
    ]
  },
  features: {
    title: "Built For Productivity",
    items: [
      {
        icon: "Settings",
        title: "Smart Task Behavior",
        description: "Customize how your todos behave with intelligent sorting and auto-hide options"
      },
      {
        icon: "User",
        title: "Personalized Settings",
        description: "Your preferences control everything - from priority display to completion behavior"
      },
      {
        icon: "Layout",
        title: "Clean, Distraction-Free UI",
        description: "Focus on your work with a minimal interface that adapts to your needs"
      },
      {
        icon: "Zap",
        title: "Fast & Responsive",
        description: "Built for speed with instant updates and smooth interactions"
      }
    ]
  },
  cta: {
    headline: "Start organizing your work today",
    buttonText: "Create Free Account"
  },
  footer: {
    appName: "Todos",
    tagline: "Productivity simplified",
    copyright: "© 2026 Todos. All rights reserved.",
    links: [
      { text: "Privacy Policy", href: "/privacy" },
      { text: "GitHub", href: "https://github.com/yourusername/todos" }
    ]
  }
} as const;
