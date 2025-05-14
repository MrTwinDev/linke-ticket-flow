
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatStatus, getStatusClass, formatDate } from "@/utils/ticketUtils";
import { Ticket } from "@/types/ticket";
import { ProfileType } from "@/types/auth";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

interface TicketsTableProps {
  tickets: Ticket[];
  isLoading: boolean;
  profileType: ProfileType | null;
}

const TicketsTable = ({ tickets, isLoading, profileType }: TicketsTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-8 text-center">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-linkeblue-600"></div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Carregando tickets...</p>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-8 text-center">
          <p className="text-gray-500">Nenhum ticket encontrado.</p>
          {profileType === "importer" && (
            <Link to="/dashboard/tickets/create" className="mt-2 inline-block">
              <Button variant="outline" size="sm">
                Crie seu primeiro ticket
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs uppercase text-gray-500">Título</TableHead>
              <TableHead className="text-xs uppercase text-gray-500">Status</TableHead>
              <TableHead className="text-xs uppercase text-gray-500">Criado</TableHead>
              <TableHead className="text-xs uppercase text-gray-500">
                {profileType === "importer" ? "Despachante" : "Importador"}
              </TableHead>
              <TableHead className="text-xs uppercase text-gray-500 text-center">Mensagens</TableHead>
              <TableHead className="text-xs uppercase text-gray-500 text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(ticket.status)}`}>
                    {formatStatus(ticket.status)}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {formatDate(ticket.createdAt)}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {profileType === "importer" ? ticket.broker.name : ticket.importer.name}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-linkeblue-100 text-linkeblue-800 text-xs font-medium">
                    {ticket.messages}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/dashboard/tickets/${ticket.id}`}>
                    <Button variant="outline" size="sm">
                      Visualizar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TicketsTable;
