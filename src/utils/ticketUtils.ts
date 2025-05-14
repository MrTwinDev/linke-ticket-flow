
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

export const formatStatus = (status: string) => {
  switch (status) {
    case "open":
      return "Aberto";
    case "in_progress":
      return "Em Andamento";
    case "completed":
      return "Concluído";
    case "cancelled":
      return "Cancelado";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
