
// Helper function to get status badge class
export const getStatusClass = (status: string) => {
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
export const formatStatus = (status: string) => {
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
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
