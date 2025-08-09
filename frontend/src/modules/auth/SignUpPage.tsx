import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { api } from '../../shared/api/client'
import { Button, Card, ErrorText, Field, Input, Label } from '../../shared/components/Form'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import loadingAnim from '../../shared/animations/loading.json'

const Title = styled.h2`
  margin: 0 0 18px;
`

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export const SignUpPage: React.FC = () => {
  const { setToken } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email])
  const passwordsMatch = useMemo(() => password === confirmPassword, [password, confirmPassword])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (!emailValid) throw new Error('Invalid email')
      if (!passwordsMatch) throw new Error('Passwords do not match')
      const res = await api.post(`/users`, {
        user: { email, password }
      }, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      })
      const token = res.data?.token
      if (!token) throw new Error('No token returned')
      setToken(token)
      navigate('/')
    } catch (err: any) {
      const msg = err?.response?.data?.errors?.join?.(', ') || err.message || 'Sign up failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card as="form" onSubmit={onSubmit}>
      <Title>Create your account</Title>
      <Field>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required aria-invalid={!emailValid} />
        {!emailValid && email.length > 0 && <ErrorText>Enter a valid email address</ErrorText>}
      </Field>
      <Field>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
      </Field>
      <Field>
        <Label htmlFor="confirm">Confirm Password</Label>
        <Input id="confirm" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} aria-invalid={!passwordsMatch} />
        {!passwordsMatch && confirmPassword.length > 0 && <ErrorText>Passwords do not match</ErrorText>}
      </Field>
      <Field style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -8 }}>
        <input id="show" type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} />
        <Label htmlFor="show">Show password</Label>
      </Field>
      {error && <ErrorText>{error}</ErrorText>}
      <Button type="submit" disabled={loading || !emailValid || !passwordsMatch}>{loading ? <Lottie animationData={loadingAnim} loop style={{ height: 28 }} /> : 'Sign Up'}</Button>
    </Card>
  )
}

