
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCEP } from "@/utils/validation";
import { fetchAddressByCep } from "@/utils/viaCep";
import { useToast } from "@/hooks/use-toast";

interface Step2AddressProps {
  cep: string;
  setCep: (cep: string) => void;
  street: string;
  setStreet: (street: string) => void;
  number: string;
  setNumber: (number: string) => void;
  complement: string;
  setComplement: (complement: string) => void;
  neighborhood: string;
  setNeighborhood: (neighborhood: string) => void;
  city: string;
  setCity: (city: string) => void;
  state: string;
  setState: (state: string) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrev: () => void;
}

const Step2Address = ({
  cep,
  setCep,
  street,
  setStreet,
  number,
  setNumber,
  complement,
  setComplement,
  neighborhood,
  setNeighborhood,
  city,
  setCity,
  state,
  setState,
  errors,
  onNext,
  onPrev
}: Step2AddressProps) => {
  const [isCepLoading, setIsCepLoading] = useState(false);
  const { toast } = useToast();

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedCep = formatCEP(value);
    setCep(formattedCep);
    
    // When CEP is complete, fetch address
    if (formattedCep.replace(/\D/g, "").length === 8) {
      handleCepLookup(formattedCep);
    }
  };
  
  const handleCepLookup = async (cepValue: string) => {
    setIsCepLoading(true);
    try {
      const address = await fetchAddressByCep(cepValue);
      if (address) {
        setStreet(address.street);
        setNeighborhood(address.neighborhood);
        setCity(address.city);
        setState(address.state);
        setComplement(address.complement);
        // Focus on the number field after address is populated
        document.getElementById("address-number")?.focus();
      } else {
        toast({
          variant: "destructive",
          title: "Endereço não encontrado",
          description: "CEP não encontrado. Por favor, insira os detalhes do endereço manualmente.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar endereço",
        description: "Ocorreu um erro. Por favor, insira os detalhes do endereço manualmente.",
      });
    } finally {
      setIsCepLoading(false);
    }
  };

  return (
    <form>
      <div className="space-y-4">
        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            value={cep}
            onChange={handleCepChange}
            className={`mt-1 ${errors.cep ? "border-red-500" : ""}`}
            placeholder="00000-000"
            disabled={isCepLoading}
          />
          {errors.cep && (
            <p className="text-red-500 text-xs mt-1">{errors.cep}</p>
          )}
        </div>

        <div>
          <Label htmlFor="street">Logradouro</Label>
          <Input
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className={`mt-1 ${errors.street ? "border-red-500" : ""}`}
            placeholder="Nome da rua"
            disabled={isCepLoading}
          />
          {errors.street && (
            <p className="text-red-500 text-xs mt-1">{errors.street}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address-number">Número</Label>
            <Input
              id="address-number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className={`mt-1 ${errors.number ? "border-red-500" : ""}`}
              placeholder="123"
              disabled={isCepLoading}
            />
            {errors.number && (
              <p className="text-red-500 text-xs mt-1">{errors.number}</p>
            )}
          </div>

          <div>
            <Label htmlFor="complement">Complemento (opcional)</Label>
            <Input
              id="complement"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              className="mt-1"
              placeholder="Apto, Sala, etc."
              disabled={isCepLoading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className={`mt-1 ${errors.neighborhood ? "border-red-500" : ""}`}
            placeholder="Bairro"
            disabled={isCepLoading}
          />
          {errors.neighborhood && (
            <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`mt-1 ${errors.city ? "border-red-500" : ""}`}
              placeholder="Cidade"
              disabled={isCepLoading}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={`mt-1 ${errors.state ? "border-red-500" : ""}`}
              placeholder="Estado"
              disabled={isCepLoading}
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state}</p>
            )}
          </div>
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
          type="button"
          className="w-1/2"
          onClick={onNext}
          disabled={isCepLoading}
        >
          Próximo: Criar Senha
        </Button>
      </div>
    </form>
  );
};

export default Step2Address;
