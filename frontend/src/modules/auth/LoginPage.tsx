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

export const LoginPage: React.FC = () => {
  const { setToken, setUser, uiRole, setUiRole, setViewLockedAsMember } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (!emailValid) throw new Error('Invalid email')
      const res = await api.post(`/users/sign_in`, {
        user: { email, password }
      })
      const token = res.data?.token
      const user = res.data?.user as { id: number; email: string; role?: 'member' | 'librarian' }
      if (!token) throw new Error('No token returned')
      setToken(token)
      setUser(user)
      // Lock view if server user role is member OR if UI selected Member
      if (user?.role === 'member' || uiRole === 'member') {
        setViewLockedAsMember(true)
      } else {
        setViewLockedAsMember(false)
      }
      navigate('/')
    } catch (err: any) {
      const msg = err?.response?.data?.errors?.join?.(', ') || 'Invalid credentials'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card as="form" onSubmit={onSubmit}>
      <Title>Welcome back</Title>
      <Field style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Label htmlFor="role">Login as</Label>
        <div style={{ display: 'flex', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="radio"
              name="role"
              value="member"
              checked={uiRole === 'member'}
              onChange={() => setUiRole('member')}
            />
            Member
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="radio"
              name="role"
              value="librarian"
              checked={uiRole === 'librarian'}
              onChange={() => setUiRole('librarian')}
            />
            Librarian
          </label>
        </div>
      </Field>
      <Field>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required aria-invalid={!emailValid} />
        {!emailValid && email.length > 0 && <ErrorText>Enter a valid email address</ErrorText>}
      </Field>
      <Field>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required />
      </Field>
      <Field style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -8 }}>
        <input id="show" type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} />
        <Label htmlFor="show">Show password</Label>
      </Field>
      {error && <ErrorText>{error}</ErrorText>}
      <Button type="submit" disabled={loading || !emailValid}>{loading ? <Lottie animationData={loadingAnim} loop style={{ height: 28 }} /> : 'Log In'}</Button>
    </Card>
  )
}

