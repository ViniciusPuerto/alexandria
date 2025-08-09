import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../../modules/auth/AuthContext'
import { useNavigate } from 'react-router-dom'

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: saturate(180%) blur(12px);
  background: linear-gradient(180deg, rgba(21,24,32,0.9) 0%, rgba(21,24,32,0.6) 100%);
  border-bottom: 1px solid rgba(255,255,255,0.06);
`

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Brand = styled.div`
  display: flex; align-items: center; gap: 12px;
  font-weight: 700; letter-spacing: 0.6px;
  color: ${p => p.theme.colors.text};
`

const Logo = styled.div`
  width: 36px; height: 36px; border-radius: 10px;
  background: conic-gradient(from 180deg at 50% 50%, #4C7DF0, #F0B429, #4C7DF0);
  box-shadow: ${p => p.theme.shadow.md};
`

const Title = styled.h1`
  font-size: 20px; margin: 0;
`

const Right = styled.div`
  display: flex; align-items: center; gap: 12px;
`

const Avatar = styled.button`
  width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.15));
  display: grid; place-items: center;
  color: ${p => p.theme.colors.text};
  cursor: pointer;
`

const Menu = styled.div`
  position: absolute; right: 24px; top: 60px;
  background: ${p => p.theme.colors.surface};
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: ${p => p.theme.radius.md};
  padding: 10px; min-width: 220px;
  box-shadow: ${p => p.theme.shadow.md};
  display: flex; flex-direction: column; gap: 8px;
`

const MenuItem = styled.button`
  width: 100%; text-align: left;
  background: transparent; border: none; color: ${p => p.theme.colors.text};
  padding: 8px 10px; border-radius: ${p => p.theme.radius.sm}; cursor: pointer;
  &:hover { background: rgba(255,255,255,0.06); }
`

export const Header: React.FC = () => {
  const { user, token, logout, uiRole, setUiRole, viewLockedAsMember } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    // redirect rules
    if (token) {
      if (location.pathname === '/login' || location.pathname === '/signup') {
        navigate('/')
      }
    } else {
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login')
      }
    }
  }, [token, navigate])

  return (
    <Bar>
      <Inner>
        <Brand>
          <Logo />
          <Title>Alexandria</Title>
          {token && uiRole === 'librarian' && !viewLockedAsMember && (
            <span style={{
              marginLeft: 10,
              fontSize: 12,
              color: '#F0B429',
              border: '1px solid rgba(240,180,41,0.35)',
              padding: '2px 6px',
              borderRadius: 8
            }}>
              Librarian mode
            </span>
          )}
        </Brand>
        <Right ref={ref}>
          <Avatar onClick={() => setOpen(o => !o)} aria-label="Account">
            {/* person icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" fill="currentColor"/>
            </svg>
          </Avatar>
          {open && (
            <Menu>
              <div style={{ color: '#B9C0CC', fontSize: 14, padding: '4px 6px' }}>{user?.email ?? 'Guest'}</div>
              <div style={{ display: 'flex', gap: 8, padding: '4px 6px', alignItems: 'center' }}>
                <span style={{ color: '#B9C0CC', fontSize: 13 }}>View as:</span>
                <button onClick={() => setUiRole('member')} style={{ background: uiRole==='member'?'rgba(255,255,255,0.08)':'transparent', color: 'inherit', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '4px 8px', cursor: 'pointer' }}>Member</button>
                <button disabled={viewLockedAsMember} onClick={() => setUiRole('librarian')} style={{ background: uiRole==='librarian'&&!viewLockedAsMember?'rgba(255,255,255,0.08)':'transparent', opacity: viewLockedAsMember?0.5:1, color: 'inherit', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '4px 8px', cursor: viewLockedAsMember?'not-allowed':'pointer' }}>Librarian</button>
              </div>
              {token ? (
                <MenuItem onClick={() => { logout(); navigate('/login') }}>Logout</MenuItem>
              ) : (
                <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
              )}
            </Menu>
          )}
        </Right>
      </Inner>
    </Bar>
  )
}

