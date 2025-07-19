import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Archive,
  FileText,
  Briefcase,
  TrendingUp,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend: string;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, trend, color }: StatCardProps) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center text-xs text-green-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend} vs last month
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

interface StatsGridProps {
  conversationsCount: number;
  archivedCount: number;
  documentsCount: number;
  mattersCount: number;
}

export const StatsGrid = ({
  conversationsCount,
  archivedCount,
  documentsCount,
  mattersCount,
}: StatsGridProps) => {
  const stats = [
    {
      title: "Active Conversations",
      value: conversationsCount,
      icon: MessageSquare,
      trend: "+12%",
      color: "bg-primary",
    },
    {
      title: "Archived Chats",
      value: archivedCount,
      icon: Archive,
      trend: "+8%",
      color: "bg-purple-500",
    },
    {
      title: "Documents Generated",
      value: documentsCount,
      icon: FileText,
      trend: "+25%",
      color: "bg-green-500",
    },
    {
      title: "Active Matters",
      value: mattersCount,
      icon: Briefcase,
      trend: "+5%",
      color: "bg-orange-500",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </motion.div>
  );
};