
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Search } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  broker: {
    id: string;
    name: string;
  };
  importer: {
    id: string;
    name: string;
  };
  messages: number;
  pendingEditApproval: boolean;
}

const Tickets = () => {
  const { profileType } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching tickets from API
    setTimeout(() => {
      const mockTickets: Ticket[] = [
        {
          id: "1",
          title: "Desembaraço aduaneiro para peças de maquinário",
          description: "Necessita desembaraço aduaneiro para peças de maquinário industrial vindas da Alemanha.",
          status: "open",
          createdAt: "2025-04-30T10:30:00",
          updatedAt: "2025-04-30T10:30:00",
          broker: {
            id: "b1",
            name: "Jane Smith"
          },
          importer: {
            id: "i1",
            name: "Empresa Importadora Ltda"
          },
          messages: 3,
          pendingEditApproval: false
        },
        {
          id: "2",
          title: "Documentação para remessa de têxteis",
          description: "Solicitando assistência com documentação de importação para produtos têxteis da China.",
          status: "in_progress",
          createdAt: "2025-04-28T14:20:00",
          updatedAt: "2025-04-29T09:45:00",
          broker: {
            id: "b1",
            name: "Jane Smith"
          },
          importer: {
            id: "i1",
            name: "Empresa Importadora Ltda"
          },
          messages: 8,
          pendingEditApproval: true
        },
        {
          id: "3",
          title: "Desembaraço aduaneiro para eletrônicos",
          description: "Preciso de ajuda com desembaraço aduaneiro para uma remessa de smartphones e acessórios.",
          status: "completed",
          createdAt: "2025-04-25T09:15:00",
          updatedAt: "2025-04-27T11:20:00",
          broker: {
            id: "b1",
            name: "Jane Smith"
          },
          importer: {
            id: "i1",
            name: "Empresa Importadora Ltda"
          },
          messages: 12,
          pendingEditApproval: false
        },
        {
          id: "4",
          title: "Cálculo de imposto para autopeças",
          description: "Preciso de assistência para calcular impostos de importação para peças automotivas.",
          status: "cancelled",
          createdAt: "2025-04-23T16:10:00",
          updatedAt: "2025-04-24T10:30:00",
          broker: {
            id: "b1",
            name: "Jane Smith"
          },
          importer: {
            id: "i1",
            name: "Empresa Importadora Ltda"
          },
          messages: 2,
          pendingEditApproval: false
        },
        {
          id: "5",
          title: "Desembaraço emergencial para suprimentos médicos",
          description: "Necessito de desembaraço aduaneiro acelerado para remessa de suprimentos médicos.",
          status: "open",
          createdAt: "2025-04-22T08:05:00",
          updatedAt: "2025-04-22T08:05:00",
          broker: {
            id: "b1",
            name: "Jane Smith"
          },
          importer: {
            id: "i1",
            name: "Empresa Importadora Ltda"
          },
          messages: 5,
          pendingEditApproval: false
        },
      ];
      
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter tickets when search term or status filter changes
  useEffect(() => {
    let filtered = tickets;
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(term) || 
        ticket.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredTickets(filtered);
  }, [searchTerm, statusFilter, tickets]);

  // Helper function to get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "open":
        return "status-open";
      case "in_progress":
        return "status-in-progress";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  // Helper function to format status text
  const formatStatus = (status: string) => {
    switch (status) {
      case "in_progress":
        return "Em Andamento";
      case "open":
        return "Aberto";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600">
            Gerencie seus tickets de {profileType === "importer" ? "importação" : "cliente"}
          </p>
        </div>

        {profileType === "importer" && (
          <Link to="/dashboard/tickets/create">
            <Button>Criar Novo Ticket</Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Pesquisar tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tickets List */}
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
              ) : filteredTickets.length === 0 ? (
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
                filteredTickets.map((ticket) => (
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
    </div>
  );
};

export default Tickets;
