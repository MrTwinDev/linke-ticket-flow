
import { Loader } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProfileActionsProps {
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onDeleteAccount: () => Promise<void>;
}

export const ProfileActions = ({
  isLoading,
  isSaving,
  isDeleting,
  onDeleteAccount,
}: ProfileActionsProps) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isLoading || isSaving}
          >
            {isSaving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full md:w-auto"
                disabled={isLoading || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  "Excluir Conta"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Sua conta será permanentemente excluída
                  e todos os seus dados serão removidos dos nossos servidores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteAccount}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Sim, excluir minha conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
