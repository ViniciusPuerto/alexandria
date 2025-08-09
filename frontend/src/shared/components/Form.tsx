import styled from 'styled-components'

export const Card = styled.div`
  background: ${p => p.theme.colors.surface};
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: ${p => p.theme.radius.lg};
  box-shadow: ${p => p.theme.shadow.sm};
  padding: 28px;
`

export const Field = styled.div`
  display: flex; flex-direction: column; gap: 8px;
  margin-bottom: 18px;
`

export const Label = styled.label`
  color: ${p => p.theme.colors.textMuted};
  font-size: 14px;
`

export const Input = styled.input`
  background: #0f1218;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: ${p => p.theme.radius.md};
  padding: 12px 14px;
  color: ${p => p.theme.colors.text};
  outline: none;
  transition: border-color .2s ease;
  &:focus { border-color: ${p => p.theme.colors.primary}; }
`

export const Button = styled.button`
  background: ${p => p.theme.colors.primary};
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: ${p => p.theme.radius.md};
  cursor: pointer;
  font-weight: 600;
  transition: background .2s ease, transform .05s ease;
  &:hover { background: ${p => p.theme.colors.primaryDark}; }
  &:active { transform: translateY(1px); }
  width: 100%;
`

export const ErrorText = styled.p`
  color: #ff8181; margin: 8px 0 0; font-size: 14px;
`

