"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  MessageSquare, 
  Mail, 
  Github, 
  CreditCard, 
  Brain,
  Slack,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Database,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

interface ActivityItem {
  id: string;
  type: string;
  source: string;
  message: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

const initialMetrics: Metric[] = [
  { label: "Stripe Revenue", value: "$12,450", change: "+23%", trend: "up", icon: <CreditCard className="w-4 h-4" /> },
  { label: "GitHub Commits", value: "147", change: "+12 today", trend: "up", icon: <Github className="w-4 h-4" /> },
  { label: "Slack Messages", value: "89", change: "-5%", trend: "down", icon: <Slack className="w-4 h-4" /> },
  { label: "Memory Entries", value: "2,847", change: "+42 new", trend: "up", icon: <Brain className="w-4 h-4" /> },
  { label: "Emails Unread", value: "23", change: "+3", trend: "up", icon: <Mail className="w-4 h-4" /> },
  { label: "GHL Leads", value: "156", change: "+8 today", trend: "up", icon: <Database className="w-4 h-4" /> },
];

const initialActivities: ActivityItem[] = [
  { id: "1", type: "message", source: "Telegram", message: "New message from Will", timestamp: "2m ago", icon: <MessageSquare className="w-4 h-4" />, color: "bg-blue-500" },
  { id: "2", type: "commit", source: "GitHub", message: "Pushed 3 commits to nexus", timestamp: "5m ago", icon: <Github className="w-4 h-4" />, color: "bg-zinc-500" },
  { id: "3", type: "payment", source: "Stripe", message: "Payment received: $299", timestamp: "12m ago", icon: <CreditCard className="w-4 h-4" />, color: "bg-green-500" },
  { id: "4", type: "memory", source: "SuperMemory", message: "New memory: ServiceLine Pro Q1 goals", timestamp: "15m ago", icon: <Brain className="w-4 h-4" />, color: "bg-purple-500" },
  { id: "5", type: "slack", source: "Slack", message: "New mention in #general", timestamp: "23m ago", icon: <Slack className="w-4 h-4" />, color: "bg-orange-500" },
  { id: "6", type: "email", source: "Gmail", message: "New email: Project update", timestamp: "32m ago", icon: <Mail className="w-4 h-4" />, color: "bg-red-500" },
  { id: "7", type: "lead", source: "GHL", message: "New lead: HVAC Pros Inc", timestamp: "45m ago", icon: <Database className="w-4 h-4" />, color: "bg-cyan-500" },
  { id: "8", type: "calendar", source: "Google Calendar", message: "Meeting: Strategy call in 1h", timestamp: "1h ago", icon: <Calendar className="w-4 h-4" />, color: "bg-yellow-500" },
];

const integrations = [
  { name: "Telegram", status: "connected", icon: <MessageSquare className="w-5 h-5" /> },
  { name: "Slack", status: "connected", icon: <Slack className="w-5 h-5" /> },
  { name: "GitHub", status: "connected", icon: <Github className="w-5 h-5" /> },
  { name: "Stripe", status: "connected", icon: <CreditCard className="w-5 h-5" /> },
  { name: "GHL", status: "connected", icon: <Database className="w-5 h-5" /> },
  { name: "SuperMemory", status: "connected", icon: <Brain className="w-5 h-5" /> },
  { name: "Gmail", status: "connected", icon: <Mail className="w-5 h-5" /> },
  { name: "Google Calendar", status: "connected", icon: <Calendar className="w-5 h-5" /> },
];

// Simulate real-time data updates
const generateRandomActivity = (): ActivityItem => {
  const types = [
    { type: "message", source: "Telegram", color: "bg-blue-500", icon: <MessageSquare className="w-4 h-4" /> },
    { type: "commit", source: "GitHub", color: "bg-zinc-500", icon: <Github className="w-4 h-4" /> },
    { type: "payment", source: "Stripe", color: "bg-green-500", icon: <CreditCard className="w-4 h-4" /> },
    { type: "memory", source: "SuperMemory", color: "bg-purple-500", icon: <Brain className="w-4 h-4" /> },
    { type: "slack", source: "Slack", color: "bg-orange-500", icon: <Slack className="w-4 h-4" /> },
    { type: "email", source: "Gmail", color: "bg-red-500", icon: <Mail className="w-4 h-4" /> },
  ];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const messages: Record<string, string[]> = {
    "Telegram": ["New message from Will", "Reply from Rayssa", "Group message in #earl-chat", "Direct message from Daniel"],
    "GitHub": ["Pushed 2 commits to nexus", "PR merged: #42", "New issue created", "Repository starred"],
    "Stripe": ["Payment received: $299", "Payment received: $499", "New subscription", "Invoice paid: $1,200"],
    "SuperMemory": ["New memory created", "Memory updated: Project notes", "Cross-reference found", "Knowledge graph updated"],
    "Slack": ["New mention in #general", "Message in #engineering", "DM from Kevin", "Thread reply in #marketing"],
    "Gmail": ["New email: Invoice", "Meeting invitation", "Newsletter: Tech Weekly", "Project update from client"]
  };
  
  const msgs = messages[type.source] || ["New activity"];
  
  return {
    id: Date.now().toString(),
    type: type.type,
    source: type.source,
    message: msgs[Math.floor(Math.random() * msgs.length)],
    timestamp: "Just now",
    icon: type.icon,
    color: type.color
  };
};

export function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("all");
  const [metrics, setMetrics] = useState(initialMetrics);
  const [activities, setActivities] = useState(initialActivities);
  const [uptime, setUptime] = useState(99.9);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add new activity occasionally
      if (Math.random() > 0.7) {
        const newActivity = generateRandomActivity();
        setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
        
        // Update metrics based on activity
        setMetrics(prev => prev.map(m => {
          if (newActivity.source === "Stripe" && m.label === "Stripe Revenue") {
            return { ...m, change: "+24%", trend: "up" };
          }
          if (newActivity.source === "GitHub" && m.label === "GitHub Commits") {
            return { ...m, value: "148", change: "+13 today", trend: "up" };
          }
          if (newActivity.source === "Slack" && m.label === "Slack Messages") {
            return { ...m, value: "90", change: "-4%", trend: "neutral" };
          }
          if (newActivity.source === "SuperMemory" && m.label === "Memory Entries") {
            return { ...m, value: "2,848", change: "+43 new", trend: "up" };
          }
          return m;
        }));
      }
      
      // Slightly vary uptime
      setUptime(prev => {
        const variation = (Math.random() - 0.5) * 0.01;
        return Math.min(99.99, Math.max(99.9, prev + variation));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredActivities = activeTab === "all" 
    ? activities 
    : activities.filter(a => a.type === activeTab);

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-6">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center glow-border">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-950 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              NEXUS
            </h1>
            <p className="text-zinc-500 text-sm">EARL Command Center</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-zinc-800 bg-zinc-900/50">
            <Activity className="w-3 h-3 mr-1 text-green-400" />
            All Systems Online
          </Badge>
          <div className="text-right">
            <p className="text-lg font-mono text-zinc-300">
              {currentTime.toLocaleTimeString()}
            </p>
            <p className="text-xs text-zinc-500">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500">{metric.icon}</span>
                <Badge 
                  variant={metric.trend === "up" ? "default" : metric.trend === "down" ? "destructive" : "secondary"}
                  className="text-[10px]"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metric.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-zinc-100">{metric.value}</p>
              <p className="text-xs text-zinc-500">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-zinc-100">
                <Activity className="w-5 h-5 text-violet-400" />
                Live Activity Feed
              </CardTitle>
              <Badge variant="outline" className="border-green-800 bg-green-950/30 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-zinc-950 border border-zinc-800 mb-4">
                <TabsTrigger value="all" className="data-[state=active]:bg-zinc-800">All</TabsTrigger>
                <TabsTrigger value="message" className="data-[state=active]:bg-zinc-800">Messages</TabsTrigger>
                <TabsTrigger value="commit" className="data-[state=active]:bg-zinc-800">Git</TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-zinc-800">Stripe</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {filteredActivities.map((activity, idx) => (
                    <div 
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-700 transition-all animate-slide-in"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className={`w-8 h-8 rounded-lg ${activity.color} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white">{activity.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-zinc-400">{activity.source}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-xs text-zinc-500">{activity.timestamp}</span>
                        </div>
                        <p className="text-sm text-zinc-200 mt-0.5 truncate">{activity.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>

        {/* Integrations Status */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {integrations.map((integration, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                        {integration.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{integration.name}</p>
                        <p className="text-xs text-zinc-500">Via Composio</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-green-800 bg-green-950/30 text-green-400 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1" />
                      {integration.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <Separator className="my-4 bg-zinc-800" />
            
            <div className="p-3 rounded-lg bg-violet-950/20 border border-violet-800/30">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-violet-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-violet-200">Pro Tip</p>
                  <p className="text-xs text-violet-400/70 mt-1">Use /commands in Telegram to control any connected integration.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/30 border-zinc-800/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xs text-zinc-500">Uptime</p>
              <p className="text-lg font-semibold text-zinc-200">{uptime.toFixed(2)}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/30 border-zinc-800/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-xs text-zinc-500">API Calls</p>
              <p className="text-lg font-semibold text-zinc-200">12.4K</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/30 border-zinc-800/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Database className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-xs text-zinc-500">Data Synced</p>
              <p className="text-lg font-semibold text-zinc-200">2.1GB</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/30 border-zinc-800/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Activity className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-xs text-zinc-500">Active Tasks</p>
              <p className="text-lg font-semibold text-zinc-200">8</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
