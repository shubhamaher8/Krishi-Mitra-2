"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, TrendingUp, Shield } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Activity = {
  id: number;
  type: "recommendation" | "price" | "disease";
  title: string;
  description: string;
  icon: "Brain" | "TrendingUp" | "Shield";
  time: string; // ISO string from backend
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [, setTick] = useState(0); // for re-rendering every minute
const WS_URL = process.env.NEXT_PUBLIC_WS_URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  
  // WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;
    const ws = new WebSocket("wss://your-app.onrender.com/ws/activities");

    ws.onmessage = (event) => {
      const newActivity: Activity = JSON.parse(event.data);
      setActivities(prev => [newActivity, ...prev]);
      setHighlightId(newActivity.id);
      setTimeout(() => setHighlightId(null), 2000); // highlight for 2 seconds
    };

    ws.onclose = () => console.log("WebSocket closed");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.close();
  }, []);

  // Trigger re-render every minute to update relative times
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const getBgColor = (activity: Activity) => {
    switch (activity.type) {
      case "recommendation": return "bg-accent/20";
      case "price": return "bg-blue-100";
      case "disease": return "bg-green-100";
      default: return "bg-gray-100";
    }
  };

  const getIcon = (activity: Activity) => {
    switch (activity.icon) {
      case "Brain": return <Brain className="h-5 w-5 text-accent" />;
      case "TrendingUp": return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case "Shield": return <Shield className="h-5 w-5 text-green-600" />;
      default: return null;
    }
  };

  return (
    <Card className="mt-8 animate-fade-in-up">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest farming insights and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map(activity => (
            <div
              key={activity.id}
              className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-500
                ${getBgColor(activity)}
                ${highlightId === activity.id ? "ring-2 ring-offset-2 ring-yellow-400" : ""}
              `}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                {getIcon(activity)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {dayjs(activity.time).fromNow()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
