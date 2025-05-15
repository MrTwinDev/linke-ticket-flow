// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"; // ✅ CORRIGIDO

interface Ticket {
  id: string;
  title: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  broker: {
    name: string;
  };
  messages: number;
}

const Dashboard = () => {
  const { currentUser, profileType } = useAuth();
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const mockRecentTickets: Ticket[] = [
      {
        id: "1",
        title: "Desembaraço de peças de maquinário",
        status: "open",
        createdAt: "2025-04-30T10:30:00",
        broker: { name: "Jane Smith" },
        messages: 3,
      },
      {
        id: "2",
        title: "Documentação para envio de têxteis",
        status: "in_progress",
        createdAt: "2025-04-28T14:20:00",
        broker: { name: "Jane Smith" },
        messages: 8,
      },
      {
        id: "3",
        title: "Desembaraço aduaneiro para eletrônicos",
        status: "completed",
        createdAt: "2025-04-25T09:15:00",
        broker: { name: "Jane Smith" },
        messages: 12,
      },
    ];

    setRecentTickets(mockRecentTickets);
    setTicketStats({ total: 15, open: 4, inProgress: 6, completed: 3, cancelled: 2 });
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "open": return "status-open";
      case "in_progress": return "status-in-progress";
      case "completed": return "status-completed";
      case "cancelled": return "status-cancelled";
      default: return "";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "open": return "Aberto";
      case "in_progress": return "Em Andamento";
      case "completed": return "Concluído";
      case "cancelled": return "Cancelado";
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel</h1>
          <p className="text-gray-600">
            Bem-vindo de volta, {profileType === "importer" 
              ? currentUser?.fullName || currentUser?.companyName 
              : currentUser?.fullName}
          </p>
        </div>
        {profileType === "importer" && (
          <Link to="/dashboard/tickets/create">
            <Button className="mt-4 md:mt-0">Criar Novo Ticket</Button>
          </Link>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total de Tickets", value: ticketStats.total },
          { label: "Abertos", value: ticketStats.open, color: "text-amber-600" },
          { label: "Em Andamento", value: ticketStats.inProgress, color: "text-blue-600" },
          { label: "Concluídos", value: ticketStats.completed, color: "text-green-600" },
          { label: "Cancelados", value: ticketStats.cancelled, color: "text-red-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-6 text-center">
              <p className={`text-sm font-medium ${color || "text-gray-500"}`}>{label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tickets recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets Recentes</CardTitle>
          <CardDescription>Sua atividade mais recente de tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50 rounded-t-lg">
                <tr>
                  <th className="px-4 py-3 text-left">Ticket</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Criado em</th>
                  <th className="px-4 py-3 text-left">{profileType === "importer" ? "Despachante" : "Mensagens"}</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="bg-white">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{ticket.title}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(ticket.status)}`}>
                        {formatStatus(ticket.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{formatDate(ticket.createdAt)}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {profileType === "importer" ? ticket.broker.name : `${ticket.messages} mensagens`}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link to={`/dashboard/tickets/${ticket.id}`}>
                        <Button variant="outline" size="sm">Visualizar</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {recentTickets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum ticket encontrado.</p>
              {profileType === "importer" && (
                <Link to="/dashboard/tickets/create" className="mt-2 inline-block">
                  <Button variant="outline" size="sm">Crie seu primeiro ticket</Button>
                </Link>
              )}
            </div>
          )}

          {recentTickets.length > 0 && (
            <div className="mt-4 text-center">
              <Link to="/dashboard/tickets">
                <Button variant="link">Ver todos os tickets</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

