import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { api } from '../../../shared/api/client'
import Lottie from 'lottie-react'
import loadingAnim from '../../../shared/animations/loading.json'
import { useAuth } from '../../auth/AuthContext'

type Borrow = {
  id: number
  user_id: number
  book_id: number
  borrowed_at: string
  due_at: string
  returned_at: string | null
  created_at: string
  updated_at: string
}

const Section = styled.section`
  margin-top: 24px;
`

const Title = styled.h3`
  margin: 0 0 12px 0; font-size: 18px;
`

const Table = styled.div`
  width: 100%; overflow: auto; border: 1px solid rgba(255,255,255,0.06);
  border-radius: ${p => p.theme.radius.lg};
`

const TRow = styled.div`
  display: grid; grid-template-columns: 100px 120px 160px 160px 120px; gap: 12px;
  padding: 10px 14px; align-items: center;
  &:not(:last-child) { border-bottom: 1px solid rgba(255,255,255,0.06); }
  @media (max-width: 900px) {
    grid-template-columns: 80px 100px 140px 140px 100px;
  }
  @media (max-width: 600px) {
    grid-template-columns: 70px 90px 120px 120px 90px;
  }
`

const TH = styled(TRow)`
  background: rgba(255,255,255,0.04);
  font-weight: 600; font-size: 13px;
`

const Pill = styled.span<{variant?: 'danger' | 'ok'}>`
  font-size: 12px; padding: 2px 8px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  color: ${p => p.variant === 'danger' ? '#ffb4b4' : '#B9C0CC'};
  background: ${p => p.variant === 'danger' ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,255,0.06)'};
`

const LoadingWrap = styled.div`
  display: grid; place-items: center; padding: 24px;
`

const formatDate = (iso: string | null) => iso ? new Date(iso).toLocaleString() : '-'

export const CurrentBorrows: React.FC = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/borrows', { params: { user_id: user?.id } })
      setBorrows(res.data)
    } catch (e: any) {
      setError(e?.response?.data?.errors?.join?.(', ') || e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const handler = () => load()
    window.addEventListener('borrow:created', handler)
    return () => window.removeEventListener('borrow:created', handler)
  }, [load])

  const active = useMemo(() => borrows.filter(b => !b.returned_at), [borrows])
  const isOverdue = (b: Borrow) => !b.returned_at && new Date(b.due_at).getTime() < Date.now()

  if (loading) {
    return (
      <Section>
        <Title>My borrows</Title>
        <LoadingWrap>
          <Lottie animationData={loadingAnim} loop style={{ height: 64 }} />
        </LoadingWrap>
      </Section>
    )
  }

  if (error) {
    return (
      <Section>
        <Title>My borrows</Title>
        <div style={{ color: '#ff8181' }}>{error}</div>
      </Section>
    )
  }

  return (
    <Section>
      <Title>My borrows</Title>
      <Table>
        <TH>
          <div>ID</div>
          <div>Book</div>
          <div>Borrowed at</div>
          <div>Due at</div>
          <div>Status</div>
        </TH>
        {active.map(b => (
          <TRow key={b.id}>
            <div>#{b.id}</div>
            <div>{b.book_id}</div>
            <div>{formatDate(b.borrowed_at)}</div>
            <div>{formatDate(b.due_at)}</div>
            <div>
              {isOverdue(b) ? (
                <Pill variant="danger">Overdue</Pill>
              ) : (
                <Pill>Active</Pill>
              )}
            </div>
          </TRow>
        ))}
      </Table>
    </Section>
  )
}

