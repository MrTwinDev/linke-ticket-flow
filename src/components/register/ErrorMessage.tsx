
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Clock } from "lucide-react";

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;
  
  // Check if the message is a rate limit error
  const isRateLimitError = message.includes("Por motivos de segurança") || 
                           message.includes("49 segundos");
  
  return (
    <Alert variant="destructive" className="mb-4">
      {isRateLimitError ? <Clock className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorMessage;
