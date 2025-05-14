
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TicketStatsGrid } from "@/components/dashboard/TicketStats";
import { RecentTickets } from "@/components/dashboard/RecentTickets";
import { getMockRecentTickets, getMockTicketStats } from "@/data/dashboardData";
import { Ticket, TicketStats } from "@/types/dashboard";

const Dashboard = () => {
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    // Get mock data
    setRecentTickets(getMockRecentTickets());
    setTicketStats(getMockTicketStats());
  }, []);

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <TicketStatsGrid stats={ticketStats} />
      <RecentTickets tickets={recentTickets} />
    </div>
  );
};

export default Dashboard;
