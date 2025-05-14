
import { Ticket, TicketStats } from "@/types/dashboard";

// Mock data for recent tickets
export const getMockRecentTickets = (): Ticket[] => {
  return [
    {
      id: "1",
      title: "Desembaraço de peças de maquinário",
      status: "open",
      createdAt: "2025-04-30T10:30:00",
      broker: {
        name: "Jane Smith",
      },
      messages: 3,
    },
    {
      id: "2",
      title: "Documentação para envio de têxteis",
      status: "in_progress",
      createdAt: "2025-04-28T14:20:00",
      broker: {
        name: "Jane Smith",
      },
      messages: 8,
    },
    {
      id: "3",
      title: "Desembaraço aduaneiro para eletrônicos",
      status: "completed",
      createdAt: "2025-04-25T09:15:00",
      broker: {
        name: "Jane Smith",
      },
      messages: 12,
    },
  ];
};

// Mock data for ticket statistics
export const getMockTicketStats = (): TicketStats => {
  return {
    total: 15,
    open: 4,
    inProgress: 6,
    completed: 3,
    cancelled: 2,
  };
};
