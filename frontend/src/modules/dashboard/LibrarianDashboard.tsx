import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { api } from '../../shared/api/client'
import Lottie from 'lottie-react'
import loadingAnim from '../../shared/animations/loading.json'
import { BooksAdmin } from '../librarian/components/BooksAdmin'

type Metrics = {
  total_books: number
  total_borrowed_books: number
  books_due_today: number
  overdue_members: Array<any>
}

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(6, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const StatCard = styled.div`
  grid-column: span 3;
  background: ${p => p.theme.colors.surface};
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: ${p => p.theme.radius.lg};
  padding: 18px;
  display: flex; flex-direction: column; gap: 6px;
  @media (max-width: 900px) { grid-column: span 3; }
  @media (max-width: 600px) { grid-column: span 2; }
`

const StatLabel = styled.div`
  color: ${p => p.theme.colors.textMuted}; font-size: 13px;
`

const StatValue = styled.div`
  font-size: 28px; font-weight: 700;
`

const Section = styled.section`
  margin-top: 24px;
`

const SectionTitle = styled.h3`
  margin: 0 0 12px 0; font-size: 18px;
`

const Table = styled.div`
  width: 100%; overflow: auto; border: 1px solid rgba(255,255,255,0.06);
  border-radius: ${p => p.theme.radius.lg};
`

const TRow = styled.div`
  display: grid; grid-template-columns: 80px 120px 120px 160px 160px 120px; gap: 12px;
  padding: 10px 14px; align-items: center;
  &:not(:last-child) { border-bottom: 1px solid rgba(255,255,255,0.06); }
  @media (max-width: 900px) {
    grid-template-columns: 60px 100px 100px 140px 140px 100px;
  }
  @media (max-width: 600px) {
    grid-template-columns: 50px 90px 90px 120px 120px 90px;
  }
`

const TH = styled(TRow)`
  background: rgba(255,255,255,0.04);
  font-weight: 600; font-size: 13px;
`

const Button = styled.button`
  background: ${p => p.theme.colors.primary}; color: #fff; border: none; padding: 8px 10px;
  border-radius: ${p => p.theme.radius.md}; cursor: pointer; font-weight: 600;
  &:disabled { opacity: .5; cursor: not-allowed; }
`

const LoadingWrap = styled.div`
  display: grid; place-items: center; padding: 24px;
`

const formatDate = (iso: string | null) => iso ? new Date(iso).toLocaleString() : '-'

export const LibrarianDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workingIds, setWorkingIds] = useState<number[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [mRes, bRes] = await Promise.all([
          api.get('/dashboard', { params: { librarian: 'true' } }),
          api.get('/borrows')
        ])
        setMetrics(mRes.data)
        setBorrows(bRes.data)
      } catch (e: any) {
        setError(e?.response?.data?.errors?.join?.(', ') || e.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const onReturn = async (id: number) => {
    try {
      setWorkingIds(ids => [...ids, id])
      await api.post(`/borrows/${id}/return_book`)
      setBorrows(prev => prev.map(b => (b.id === id ? { ...b, returned_at: new Date().toISOString() } : b)))
      // also refresh metrics quickly
      const mRes = await api.get('/dashboard', { params: { librarian: 'true' } })
      setMetrics(mRes.data)
    } catch (e) {
      // swallow for now; could show toast
    } finally {
      setWorkingIds(ids => ids.filter(x => x !== id))
    }
  }

  if (loading) {
    return (
      <LoadingWrap>
        <Lottie animationData={loadingAnim} loop style={{ height: 64 }} />
      </LoadingWrap>
    )
  }

  if (error) {
    return <div style={{ color: '#ff8181' }}>{error}</div>
  }

  return (
    <div>
      <Grid>
        <StatCard>
          <StatLabel>Total books</StatLabel>
          <StatValue>{metrics?.total_books ?? '-'}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total borrowed</StatLabel>
          <StatValue>{metrics?.total_borrowed_books ?? '-'}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Due today</StatLabel>
          <StatValue>{metrics?.books_due_today ?? '-'}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Members overdue</StatLabel>
          <StatValue>{metrics?.overdue_members?.length ?? 0}</StatValue>
        </StatCard>
      </Grid>

      <Section>
        <SectionTitle>All borrows</SectionTitle>
        <Table>
          <TH>
            <div>ID</div>
            <div>User</div>
            <div>Book</div>
            <div>Borrowed at</div>
            <div>Due at</div>
            <div>Action</div>
          </TH>
          {borrows.map(b => (
            <TRow key={b.id}>
              <div>#{b.id}</div>
              <div>{b.user_id}</div>
              <div>{b.book_id}</div>
              <div>{formatDate(b.borrowed_at)}</div>
              <div>{formatDate(b.due_at)}</div>
              <div>
                <Button onClick={() => onReturn(b.id)} disabled={!!b.returned_at || workingIds.includes(b.id)}>
                  {b.returned_at ? 'Returned' : (workingIds.includes(b.id) ? 'Returning...' : 'Return')}
                </Button>
              </div>
            </TRow>
          ))}
        </Table>
      </Section>

      <Section>
        <SectionTitle>Books</SectionTitle>
        <BooksAdmin />
      </Section>
    </div>
  )
}

