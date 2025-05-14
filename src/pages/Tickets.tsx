
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Ticket } from "@/types/ticket";
import { fetchMockTickets } from "@/data/mockTickets";
import TicketFilters from "@/components/tickets/TicketFilters";
import TicketsTable from "@/components/tickets/TicketsTable";

const Tickets = () => {
  const { profileType } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch tickets from API
    fetchMockTickets().then(data => {
      setTickets(data);
      setFilteredTickets(data);
      setIsLoading(false);
    });
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600">
            Gerencie seus tickets {profileType === "importer" ? "de importação" : "de clientes"}
          </p>
        </div>

        {profileType === "importer" && (
          <Link to="/dashboard/tickets/create">
            <Button>Criar Novo Ticket</Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <TicketFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Tickets Table */}
      <TicketsTable
        tickets={filteredTickets}
        isLoading={isLoading}
        profileType={profileType}
      />
    </div>
  );
};

export default Tickets;
