
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ticket } from "@/types/dashboard";
import { getStatusClass, formatStatus, formatDate } from "@/utils/dashboardUtils";
import { useAuth } from "@/contexts/AuthContext";

interface RecentTicketsProps {
  tickets: Ticket[];
}

export function RecentTickets({ tickets }: RecentTicketsProps) {
  const { profileType } = useAuth();

  return (
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
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="bg-white">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {ticket.title}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(ticket.status)}`}>
                      {formatStatus(ticket.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {profileType === "importer" ? ticket.broker.name : `${ticket.messages} mensagens`}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link to={`/dashboard/tickets/${ticket.id}`}>
                      <Button variant="outline" size="sm">
                        Visualizar
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {tickets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum ticket encontrado.</p>
            {profileType === "importer" && (
              <Link to="/dashboard/tickets/create" className="mt-2 inline-block">
                <Button variant="outline" size="sm">
                  Crie seu primeiro ticket
                </Button>
              </Link>
            )}
          </div>
        )}
        
        {tickets.length > 0 && (
          <div className="mt-4 text-center">
            <Link to="/dashboard/tickets">
              <Button variant="link">Ver todos os tickets</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
