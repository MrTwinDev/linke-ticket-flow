
export interface Ticket {
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
