
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PersonType } from "@/contexts/AuthContext";

interface PersonTypeSelectorProps {
  personType: PersonType;
  onPersonTypeChange: (value: PersonType) => void;
}

const PersonTypeSelector = ({ personType, onPersonTypeChange }: PersonTypeSelectorProps) => {
  return (
    <div>
      <Label>Tipo de Pessoa</Label>
      <RadioGroup 
        defaultValue={personType} 
        className="flex space-x-4 mt-2"
        onValueChange={(value) => onPersonTypeChange(value as PersonType)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="PF" id="pf" />
          <Label htmlFor="pf">Pessoa Física (CPF)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="PJ" id="pj" />
          <Label htmlFor="pj">Pessoa Jurídica (CNPJ)</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PersonTypeSelector;
