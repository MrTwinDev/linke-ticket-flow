
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Step3SecurityProps {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  errors: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
  onPrev: () => void;
  isLoading: boolean;
}

const Step3Security = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errors,
  onSubmit,
  onPrev,
  isLoading
}: Step3SecurityProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`mt-1 ${errors.confirmPassword ? "border-red-500" : ""}`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <Button
          type="button"
          variant="outline"
          className="w-1/2"
          onClick={onPrev}
        >
          Voltar
        </Button>
        <Button
          type="submit"
          className="w-1/2"
          disabled={isLoading}
        >
          {isLoading ? "Criando conta..." : "Criar Conta"}
        </Button>
      </div>
    </form>
  );
};

export default Step3Security;
