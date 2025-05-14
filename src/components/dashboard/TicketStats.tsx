
import { StatCard } from "./StatCard";
import { TicketStats as TicketStatsType } from "@/types/dashboard";

interface TicketStatsProps {
  stats: TicketStatsType;
}

export function TicketStatsGrid({ stats }: TicketStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard 
        title="Total de Tickets" 
        value={stats.total} 
      />
      
      <StatCard 
        title="Abertos" 
        value={stats.open}
        titleClassName="text-amber-600" 
      />
      
      <StatCard 
        title="Em Andamento" 
        value={stats.inProgress}
        titleClassName="text-blue-600" 
      />
      
      <StatCard 
        title="Concluídos" 
        value={stats.completed}
        titleClassName="text-green-600" 
      />
      
      <StatCard 
        title="Cancelados" 
        value={stats.cancelled}
        titleClassName="text-red-600" 
      />
    </div>
  );
}
