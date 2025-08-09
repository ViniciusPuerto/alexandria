import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { api } from '../../../shared/api/client'
import Lottie from 'lottie-react'
import loadingAnim from '../../../shared/animations/loading.json'

type Book = {
  id: number
  title: string
  author: string | null
  genre: string | null
  isbn: string | null
  total_copies: number
}

type PagyMeta = {
  page: number
  pages: number
  vars: { items: number }
}

const Wrap = styled.section`
  margin-top: 24px;
`

const Bar = styled.form`
  display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
`

const Input = styled.input`
  flex: 1 1 320px; min-width: 200px;
  background: #0f1218; color: ${p => p.theme.colors.text}; border: 1px solid rgba(255,255,255,0.08);
  border-radius: ${p => p.theme.radius.md}; padding: 10px 12px;
`

const Button = styled.button`
  background: ${p => p.theme.colors.primary}; color: #fff; border: none; padding: 10px 14px;
  border-radius: ${p => p.theme.radius.md}; cursor: pointer; font-weight: 600;
  &:disabled { opacity: .6; cursor: not-allowed; }
`

const List = styled.div`
  margin-top: 14px; display: grid; gap: 10px;
`

const Item = styled.div`
  display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center;
  background: ${p => p.theme.colors.surface}; border: 1px solid rgba(255,255,255,0.06);
  border-radius: ${p => p.theme.radius.lg}; padding: 12px;
`

export const SearchAndBorrow: React.FC = () => {
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Book[]>([])
  const [meta, setMeta] = useState<PagyMeta | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [working, setWorking] = useState<number | null>(null)

  const page = meta?.page || 1
  const perPage = meta?.vars?.items || 10

  const search = async (pageNum = 1) => {
    try {
      setLoading(true)
      const res = await api.get('/books', { params: { q, page: pageNum, per_page: perPage } })
      setResults(res.data?.data || [])
      setMeta(res.data?.meta || null)
      setError(null)
    } catch (e: any) {
      setError(e?.response?.data?.errors?.join?.(', ') || e.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const borrow = async (bookId: number) => {
    try {
      setWorking(bookId)
      await api.post('/borrows', { book_id: bookId })
      alert('Borrow created!')
      window.dispatchEvent(new Event('borrow:created'))
    } catch (e: any) {
      const msg = e?.response?.data?.errors?.join?.(', ') || 'Failed to borrow'
      alert(msg)
    } finally {
      setWorking(null)
    }
  }

  return (
    <Wrap>
      <Bar onSubmit={(e) => { e.preventDefault(); search(1) }}>
        <Input placeholder="Search books (title, author, genre)" value={q} onChange={e => setQ(e.target.value)} />
        <Button type="submit" disabled={loading}>{loading ? 'Searching…' : 'Search'}</Button>
      </Bar>
      {loading ? (
        <div style={{ display: 'grid', placeItems: 'center', padding: 16 }}>
          <Lottie animationData={loadingAnim} loop style={{ height: 64 }} />
        </div>
      ) : (
        <List>
          {results.map(b => (
            <Item key={b.id}>
              <div>
                <div style={{ fontWeight: 600 }}>{b.title}</div>
                <div style={{ color: '#B9C0CC', fontSize: 13 }}>{b.author || '—'} · {b.genre || '—'} · {b.isbn || '—'}</div>
              </div>
              <div>
                <Button onClick={() => borrow(b.id)} disabled={working === b.id}>{working === b.id ? 'Borrowing…' : 'Borrow'}</Button>
              </div>
            </Item>
          ))}
        </List>
      )}
      {meta && meta.pages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
          <Button disabled={page <= 1 || loading} onClick={() => search(page - 1)}>Prev</Button>
          <Button disabled={page >= (meta.pages || 1) || loading} onClick={() => search(page + 1)}>Next</Button>
        </div>
      )}
      {error && <div style={{ color: '#ff8181', marginTop: 8 }}>{error}</div>}
    </Wrap>
  )
}

