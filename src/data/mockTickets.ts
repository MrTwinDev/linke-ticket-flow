
import { Ticket } from "../types/ticket";

export const fetchMockTickets = (): Promise<Ticket[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTickets: Ticket[] = [
        {
          id: "1",
          title: "Desembaraço de peças de maquinário",
          description: "Necessidade de desembaraço aduaneiro para peças de máquinas industriais da Alemanha.",
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
          title: "Documentação para envio de têxteis",
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
          title: "Cálculo de impostos para peças automotivas",
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
          title: "Liberação emergencial para suprimentos médicos",
          description: "Necessidade de desembaraço aduaneiro acelerado para remessa de suprimentos médicos.",
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
      
      resolve(mockTickets);
    }, 1000);
  });
};
