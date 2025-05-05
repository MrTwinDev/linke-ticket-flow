
interface ViaCepAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface Address {
  cep: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export async function fetchAddressByCep(cep: string): Promise<Address | null> {
  const cleanCep = cep.replace(/\D/g, '');
  
  if (cleanCep.length !== 8) {
    return null;
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data: ViaCepAddress = await response.json();
    
    if (data.erro) {
      return null;
    }
    
    return {
      cep: data.cep,
      street: data.logradouro,
      complement: data.complemento,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf
    };
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
}
