
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

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
    // Simulate fetching recent tickets from API
    const mockRecentTickets: Ticket[] = [
      {
        id: "1",
        title: "Import clearance for machinery parts",
        status: "open",
        createdAt: "2025-04-30T10:30:00",
        broker: {
          name: "Jane Smith",
        },
        messages: 3,
      },
      {
        id: "2",
        title: "Documentation for textile shipment",
        status: "in_progress",
        createdAt: "2025-04-28T14:20:00",
        broker: {
          name: "Jane Smith",
        },
        messages: 8,
      },
      {
        id: "3",
        title: "Customs clearance for electronics",
        status: "completed",
        createdAt: "2025-04-25T09:15:00",
        broker: {
          name: "Jane Smith",
        },
        messages: 12,
      },
    ];

    setRecentTickets(mockRecentTickets);

    // Simulate fetching ticket statistics
    setTicketStats({
      total: 15,
      open: 4,
      inProgress: 6,
      completed: 3,
      cancelled: 2,
    });
  }, []);

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
        return "In Progress";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {profileType === "importer" 
              ? currentUser?.fullName || currentUser?.companyName 
              : currentUser?.fullName}
          </p>
        </div>

        {profileType === "importer" && (
          <Link to="/dashboard/tickets/create">
            <Button className="mt-4 md:mt-0">
              Create New Ticket
            </Button>
          </Link>
        )}
      </div>

      {/* Ticket Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{ticketStats.total}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-amber-600">Open</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{ticketStats.open}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{ticketStats.inProgress}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{ticketStats.completed}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-red-600">Cancelled</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{ticketStats.cancelled}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
          <CardDescription>Your most recent ticket activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50 rounded-t-lg">
                <tr>
                  <th className="px-4 py-3 text-left">Ticket</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">{profileType === "importer" ? "Broker" : "Messages"}</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTickets.map((ticket) => (
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
                      {profileType === "importer" ? ticket.broker.name : `${ticket.messages} messages`}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link to={`/dashboard/tickets/${ticket.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {recentTickets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No tickets found.</p>
              {profileType === "importer" && (
                <Link to="/dashboard/tickets/create" className="mt-2 inline-block">
                  <Button variant="outline" size="sm">
                    Create your first ticket
                  </Button>
                </Link>
              )}
            </div>
          )}
          
          {recentTickets.length > 0 && (
            <div className="mt-4 text-center">
              <Link to="/dashboard/tickets">
                <Button variant="link">View all tickets</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
