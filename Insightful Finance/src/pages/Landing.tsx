import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wallet, 
  Brain, 
  PieChart, 
  Shield, 
  Sparkles, 
  TrendingUp,
  ArrowRight,
  Check
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get personalized recommendations and spending analysis powered by advanced AI."
  },
  {
    icon: PieChart,
    title: "Smart Analytics",
    description: "Visualize your spending patterns with beautiful charts and detailed breakdowns."
  },
  {
    icon: Wallet,
    title: "Budget Management",
    description: "Set budgets, track limits, and receive alerts when you're close to overspending."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is encrypted and never shared. Complete privacy guaranteed."
  }
];

const benefits = [
  "Natural language expense entry",
  "Automatic categorization",
  "Real-time budget tracking",
  "Monthly AI reports",
  "Spending forecasts",
  "Anomaly detection"
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ExpenseAI</span>
          </div>
          <Link to="/dashboard">
            <Button variant="hero" size="lg">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Personal Finance
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Take Control of Your
              <span className="text-gradient block mt-2">Financial Future</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Smart expense tracking with AI insights. Understand your spending, 
              set budgets, and achieve your financial goals effortlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/dashboard">
                <Button variant="hero" size="xl">
                  Start Tracking Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="xl">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">₹2Cr+</div>
                <div className="text-sm text-muted-foreground">Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-gradient">Master Your Money</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to give you complete visibility and control over your finances.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                variant="interactive"
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Smart Features for <span className="text-gradient">Smarter Spending</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Our AI analyzes your spending patterns and provides actionable insights 
                to help you save more and spend wisely.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              <Link to="/dashboard">
                <Button variant="hero" size="lg">
                  Get Started Now
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            <Card variant="elevated" className="p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              <div className="space-y-6 relative">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Monthly Budget</span>
                  <span className="text-sm text-primary font-medium">67% used</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-2/3 gradient-primary rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <div className="text-2xl font-bold">₹33,580</div>
                    <div className="text-sm text-muted-foreground">Spent</div>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/10">
                    <div className="text-2xl font-bold text-primary">₹16,420</div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary text-sm">
                  <Brain className="w-4 h-4" />
                  <span>AI suggests reducing food expenses by 15%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="container mx-auto max-w-3xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of users who are already saving smarter with ExpenseAI.
          </p>
          <Link to="/dashboard">
            <Button variant="hero" size="xl">
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">ExpenseAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ExpenseAI. Built with ❤️ for smart spending.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
