import React from 'react'
import { Header } from '../../shared/components/Header'
import { SignUpPage } from '../auth/SignUpPage'
import { LoginPage } from '../auth/LoginPage'
import styled from 'styled-components'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LibrarianDashboard } from '../dashboard/LibrarianDashboard'
import { MemberDashboard } from '../dashboard/MemberDashboard'
import { useAuth } from '../auth/AuthContext'

const Container = styled.div`
  max-width: 980px;
  margin: 0 auto;
  padding: 24px;
`

export const App: React.FC = () => {
  const { uiRole } = useAuth()
  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={uiRole === 'librarian' ? <LibrarianDashboard /> : <MemberDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}

