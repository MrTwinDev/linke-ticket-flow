// Exemplo adaptado de useRegisterForm.ts
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

export function useRegisterForm() {
  // ... seus estados existentes ...
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profileType, setProfileType] = useState<'importer' | 'broker'>('importer')
  const [personType, setPersonType] = useState<'PF' | 'PJ'>('PF')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [responsibleName, setResponsibleName] = useState('')
  const [responsibleCpf, setResponsibleCpf] = useState('')
  const [phone, setPhone] = useState('')
  const [documentNumber, setDocumentNumber] = useState('')
  const [cep, setCep] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setIsLoading(true)
    setApiError(null)

    // 1) cria o usuário no Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })
    if (signUpError) {
      setApiError(signUpError.message)
      setIsLoading(false)
      return
    }

    const user = signUpData.user
    if (!user) {
      setApiError('Erro inesperado: usuário não retornado.')
      setIsLoading(false)
      return
    }

    // 2) Atualiza o profile que já foi criado pelo trigger no banco
    const updates = {
      profile_type: profileType,
      person_type: personType,
      full_name: personType === 'PF' ? fullName : null,
      company_name: personType === 'PJ' ? companyName : null,
      responsible_name: personType === 'PJ' ? responsibleName : null,
      responsible_cpf: personType === 'PJ' ? responsibleCpf : null,
      phone,
      document_number: documentNumber,
      cep,
      street,
      number,
      complement,
      neighborhood,
      city,
      state
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (updateError) {
      setApiError(updateError.message)
      setIsLoading(false)
      return
    }

    // 3) Tudo certo, leva ao dashboard (ou próxima etapa)
    navigate('/dashboard')
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    profileType,
    setProfileType,
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
    phone,
    setPhone,
    documentNumber,
    setDocumentNumber,
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
    isLoading,
    apiError,
    handleSubmit,
  }
}
