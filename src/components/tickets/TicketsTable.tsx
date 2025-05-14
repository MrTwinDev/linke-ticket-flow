
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/types/ticket";
import { formatDate, formatStatus, getStatusClass } from "@/utils/ticketUtils";

interface TicketsTableProps {
  tickets: Ticket[];
  isLoading: boolean;
  profileType: string;
}

const TicketsTable = ({ tickets, isLoading, profileType }: TicketsTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-xs uppercase text-gray-500 bg-gray-50 rounded-t-lg">
            <tr>
              <th className="px-4 py-3 text-left">Título</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Criado</th>
              <th className="px-4 py-3 text-left">
                {profileType === "importer" ? "Despachante" : "Importador"}
              </th>
              <th className="px-4 py-3 text-center">Mensagens</th>
              <th className="px-4 py-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-linkeblue-600"></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Carregando tickets...</p>
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <p className="text-gray-500">Nenhum ticket encontrado.</p>
                  {profileType === "importer" && (
                    <Link to="/dashboard/tickets/create" className="mt-2 inline-block">
                      <Button variant="outline" size="sm">
                        Crie seu primeiro ticket
                      </Button>
                    </Link>
                  )}
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="bg-white">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{ticket.title}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {ticket.description}
                      </p>
                      {ticket.pendingEditApproval && (
                        <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Aprovação de edição pendente
                        </span>
                      )}
                    </div>
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
                    {profileType === "importer" ? ticket.broker.name : ticket.importer.name}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-linkeblue-100 text-linkeblue-800 text-xs font-medium">
                      {ticket.messages}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link to={`/dashboard/tickets/${ticket.id}`}>
                      <Button variant="outline" size="sm">
                        Visualizar
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketsTable;
