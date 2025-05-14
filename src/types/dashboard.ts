
export interface Ticket {
  id: string;
  title: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  broker: {
    name: string;
  };
  messages: number;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}
