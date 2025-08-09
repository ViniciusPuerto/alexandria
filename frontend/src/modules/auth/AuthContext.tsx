import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../../shared/api/client'

type AuthUser = { id: number; email: string; role?: 'member' | 'librarian' } | null
type UiRole = 'member' | 'librarian'
type AuthContextValue = {
  token: string | null
  user: AuthUser
  setToken: (t: string | null) => void
  setUser: (u: AuthUser) => void
  logout: () => void
  uiRole: UiRole
  setUiRole: (r: UiRole) => void
  viewLockedAsMember: boolean
  setViewLockedAsMember: (locked: boolean) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'))
  const [user, setUser] = useState<AuthUser>(() => {
    const raw = localStorage.getItem('auth_user')
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
  })
  const [uiRole, setUiRole] = useState<UiRole>(() => (localStorage.getItem('ui_role') as UiRole) || 'member')
  const [viewLockedAsMember, setViewLockedAsMember] = useState<boolean>(() => {
    const raw = localStorage.getItem('view_locked_member')
    return raw === 'true'
  })

  useEffect(() => {
    if (token) localStorage.setItem('auth_token', token)
    else localStorage.removeItem('auth_token')
    // wire axios default Authorization header
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    else localStorage.removeItem('auth_user')
  }, [user])

  const logout = () => {
    setToken(null)
    setUser(null)
    setViewLockedAsMember(false)
  }

  useEffect(() => {
    localStorage.setItem('ui_role', uiRole)
  }, [uiRole])

  useEffect(() => {
    localStorage.setItem('view_locked_member', String(viewLockedAsMember))
  }, [viewLockedAsMember])

  // Enforce lock: member-only view cannot switch to librarian
  useEffect(() => {
    if (viewLockedAsMember && uiRole !== 'member') {
      setUiRole('member')
    }
  }, [viewLockedAsMember, uiRole])

  const value = useMemo(() => ({ token, user, setToken, setUser, logout, uiRole, setUiRole, viewLockedAsMember, setViewLockedAsMember }), [token, user, uiRole, viewLockedAsMember])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

