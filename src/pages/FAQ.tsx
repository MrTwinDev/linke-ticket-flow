
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const FAQ = () => {
  const faqItems = [
    {
      question: "Como posso alterar meus dados cadastrais?",
      answer: "Para alterar seus dados cadastrais, acesse seu perfil clicando no menu 'Perfil' no painel lateral. Lá você encontrará opções para editar suas informações pessoais, como nome, e-mail e outras informações cadastradas."
    },
    {
      question: "Como faço para excluir minha conta?",
      answer: "Para excluir sua conta, acesse a página de Perfil do Usuário e role até o final da página. Clique no botão 'Excluir conta' e confirme sua decisão na janela de confirmação que aparecerá. Atenção: esta ação não pode ser desfeita e todos os seus dados serão removidos permanentemente."
    },
    {
      question: "Esqueci minha senha. Como posso redefini-la?",
      answer: "Na página de login, clique na opção 'Esqueceu sua senha?'. Informe o e-mail associado à sua conta e você receberá um link para redefinição de senha. Siga as instruções no e-mail para criar uma nova senha."
    },
    {
      question: "Como funcionam os tickets de importação?",
      answer: "Os tickets de importação são solicitações formais que você cria em nossa plataforma para iniciar um processo de importação. Você pode criar um novo ticket clicando em 'Criar Ticket' no menu lateral, preencher as informações necessárias e acompanhar o status do seu pedido na seção 'Tickets'."
    },
    {
      question: "Quanto tempo leva para processar um ticket de importação?",
      answer: "O tempo de processamento varia conforme a complexidade da importação e o volume de solicitações. Em média, os tickets são processados em 3 a 5 dias úteis. Você pode verificar o status atual do seu ticket a qualquer momento na seção 'Tickets'."
    },
    {
      question: "Como posso entrar em contato com o suporte técnico?",
      answer: "Você pode entrar em contato com nosso suporte técnico por meio do formulário disponível na página de Suporte. Basta preencher seus dados, selecionar a categoria do problema e descrever detalhadamente sua dúvida ou problema. Nossa equipe responderá em até 48 horas úteis."
    },
    {
      question: "Posso cancelar um ticket que já foi criado?",
      answer: "Sim, é possível cancelar tickets que ainda não foram processados. Para isso, acesse a seção 'Tickets', localize o ticket que deseja cancelar e clique na opção de cancelamento. Note que tickets já em processamento avançado podem não ser elegíveis para cancelamento."
    }
  ];

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">FAQ – Perguntas Frequentes</h1>
        <p className="text-muted-foreground">
          Encontre respostas para as perguntas mais comuns sobre nossa plataforma.
        </p>
      </div>

      <Card className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Não encontrou resposta para sua pergunta?{" "}
          <a 
            href="/dashboard/support" 
            className="text-linkeblue-600 hover:text-linkeblue-700 hover:underline"
          >
            Entre em contato com nossa equipe de suporte
          </a>
        </p>
      </div>
    </div>
  );
};

export default FAQ;
