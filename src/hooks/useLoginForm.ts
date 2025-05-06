// src/hooks/useLoginForm.ts
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ProfileType } from '@/contexts/AuthContext'

export function useLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profileType, setProfileType] = useState<ProfileType>('importer')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Tenta logar via contexto
      await login(email, password, profileType)
      // Se der certo, navega
      navigate('/dashboard')
    } catch (err: any) {
      // Exibe o erro retornado pelo contexto
      setError(err.message || 'Erro ao fazer login.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    profileType,
    setProfileType,
    isLoading,
    error,
    handleSubmit,
  }
}
