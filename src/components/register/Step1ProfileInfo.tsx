
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonType } from "@/contexts/AuthContext";
import PersonTypeSelector from "./PersonTypeSelector";
import { formatCPF, formatCNPJ, formatPhone } from "@/utils/validation";
import { Button } from "@/components/ui/button";

interface Step1ProfileInfoProps {
  personType: PersonType;
  setPersonType: (type: PersonType) => void;
  fullName: string;
  setFullName: (name: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  responsibleName: string;
  setResponsibleName: (name: string) => void;
  responsibleCpf: string;
  setResponsibleCpf: (cpf: string) => void;
  documentNumber: string;
  setDocumentNumber: (number: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  errors: Record<string, string>;
  onNext: () => void;
}

const Step1ProfileInfo = ({
  personType,
  setPersonType,
  fullName,
  setFullName,
  companyName,
  setCompanyName,
  responsibleName,
  setResponsibleName,
  responsibleCpf,
  setResponsibleCpf,
  documentNumber,
  setDocumentNumber,
  email,
  setEmail,
  phone,
  setPhone,
  errors,
  onNext
}: Step1ProfileInfoProps) => {
  const handleDocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDocumentNumber(personType === "PF" ? formatCPF(value) : formatCNPJ(value));
  };
  
  const handleResponsibleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setResponsibleCpf(formatCPF(value));
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(formatPhone(value));
  };

  return (
    <form>
      <div className="space-y-4">
        <PersonTypeSelector 
          personType={personType} 
          onPersonTypeChange={setPersonType} 
        />

        {personType === "PF" ? (
          <div>
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`mt-1 ${errors.fullName ? "border-red-500" : ""}`}
              placeholder="Seu nome completo"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={`mt-1 ${errors.companyName ? "border-red-500" : ""}`}
                placeholder="Nome da sua empresa"
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="responsibleName">Nome do Responsável</Label>
              <Input
                id="responsibleName"
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                className={`mt-1 ${errors.responsibleName ? "border-red-500" : ""}`}
                placeholder="Nome do responsável"
              />
              {errors.responsibleName && (
                <p className="text-red-500 text-xs mt-1">{errors.responsibleName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="responsibleCpf">CPF do Responsável</Label>
              <Input
                id="responsibleCpf"
                value={responsibleCpf}
                onChange={handleResponsibleCpfChange}
                className={`mt-1 ${errors.responsibleCpf ? "border-red-500" : ""}`}
                placeholder="000.000.000-00"
              />
              {errors.responsibleCpf && (
                <p className="text-red-500 text-xs mt-1">{errors.responsibleCpf}</p>
              )}
            </div>
          </>
        )}

        <div>
          <Label htmlFor="documentNumber">
            {personType === "PF" ? "CPF" : "CNPJ"}
          </Label>
          <Input
            id="documentNumber"
            value={documentNumber}
            onChange={handleDocumentNumberChange}
            className={`mt-1 ${errors.documentNumber ? "border-red-500" : ""}`}
            placeholder={personType === "PF" ? "000.000.000-00" : "00.000.000/0000-00"}
          />
          {errors.documentNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Endereço de e-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
            placeholder="voce@exemplo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            className={`mt-1 ${errors.phone ? "border-red-500" : ""}`}
            placeholder="(00) 00000-0000"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Button
          type="button"
          className="w-full"
          onClick={onNext}
        >
          Próximo: Informações de Endereço
        </Button>
      </div>
    </form>
  );
};

export default Step1ProfileInfo;
