
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HelpCircle, Mail, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  category: z.string().min(1, "Selecione uma categoria"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

const Support = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to send the support request
      console.log("Support request submitted:", values);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Solicitação enviada com sucesso!", {
        description: "Nosso time retornará em até 48h úteis."
      });
      
      form.reset();
    } catch (error) {
      toast.error("Erro ao enviar solicitação", { 
        description: "Por favor, tente novamente mais tarde." 
      });
      console.error("Error submitting support request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-5xl py-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Suporte</h1>
        <p className="text-muted-foreground">
          Precisa de ajuda? Estamos aqui para auxiliar você com qualquer dúvida ou problema.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <Card className="transition-all hover:shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <HelpCircle className="h-10 w-10 mb-4 text-linkeblue-500" />
            <h3 className="text-lg font-medium mb-2">FAQ – Perguntas Frequentes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Encontre respostas para as perguntas mais comuns.
            </p>
            <Button className="w-full" variant="outline" asChild>
              <a href="/dashboard/faq">Acessar FAQ</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <User className="h-10 w-10 mb-4 text-linkeblue-500" />
            <h3 className="text-lg font-medium mb-2">Perfil do Usuário</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Atualize suas informações pessoais e preferências.
            </p>
            <Button className="w-full" variant="outline" asChild>
              <a href="/dashboard/profile">Acessar Perfil</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Mail className="h-10 w-10 mb-4 text-linkeblue-500" />
            <h3 className="text-lg font-medium mb-2">Chat de Suporte</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Converse diretamente com nossa equipe de suporte.
            </p>
            <Button className="w-full" disabled>
              Em breve
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Formulário de Contato</CardTitle>
          <CardDescription>
            Envie sua dúvida ou problema e retornaremos o mais breve possível.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu.email@exemplo.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cadastro">Cadastro</SelectItem>
                        <SelectItem value="erro_tecnico">Erro técnico</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva sua dúvida ou problema em detalhes" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Por favor, forneça o máximo de detalhes possível para que possamos ajudar melhor.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar solicitação"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-muted-foreground text-center">
            Nosso time retornará em até 48h úteis.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Support;
