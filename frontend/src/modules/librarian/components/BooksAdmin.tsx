import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { api } from '../../../shared/api/client'
import Lottie from 'lottie-react'
import loadingAnim from '../../../shared/animations/loading.json'
import { BookModal, BookPayload } from './BookModal'

type Book = {
  id: number
  title: string
  author?: string | null
  genre?: string | null
  isbn?: string | null
  total_copies: number
}

type PagyMeta = {
  page: number
  pages: number
  next: number | null
  prev: number | null
  vars: { items: number }
  series?: (number | string)[]
}

const Section = styled.section`
  margin-top: 24px;
`

const TopBar = styled.div`
  display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: space-between;
`

const Search = styled.input`
  flex: 1 1 320px; min-width: 220px;
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

const Actions = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;
`

export const BooksAdmin: React.FC = () => {
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [initial, setInitial] = useState<BookPayload | null>(null)
  const [meta, setMeta] = useState<PagyMeta | null>(null)
  const [page, setPage] = useState<number>(1)
  const perPage = meta?.vars?.items || 10

  const fetchBooks = async (pageNum = page) => {
    try {
      setLoading(true)
      const res = await api.get('/books', { params: { q, page: pageNum, per_page: perPage } })
      setBooks(res.data?.data || [])
      setMeta(res.data?.meta || null)
      setPage(res.data?.meta?.page || pageNum)
      setError(null)
    } catch (e: any) {
      setError(e?.response?.data?.errors?.join?.(', ') || e.message || 'Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
    const onChanged = () => fetchBooks()
    window.addEventListener('books:changed', onChanged)
    return () => window.removeEventListener('books:changed', onChanged)
  }, [])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchBooks(1)
  }

  const edit = (b: Book) => {
    setInitial({ id: b.id, title: b.title, author: b.author || '', genre: b.genre || '', isbn: b.isbn || '', description: '', total_copies: b.total_copies })
    setOpen(true)
  }

  const destroy = async (id: number) => {
    if (!confirm('Delete this book?')) return
    try {
      await api.delete(`/books/${id}`)
      fetchBooks()
      window.dispatchEvent(new Event('books:changed'))
    } catch (e: any) {
      alert(e?.response?.data?.errors?.join?.(', ') || e.message || 'Delete failed')
    }
  }

  return (
    <Section>
      <form onSubmit={onSearch}>
        <TopBar>
          <Search placeholder="Search books (blank to list all)" value={q} onChange={e => setQ(e.target.value)} />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="submit">Search</Button>
            <Button type="button" onClick={() => { setInitial(null); setOpen(true) }}>New book</Button>
          </div>
        </TopBar>
      </form>

      {loading ? (
        <div style={{ display: 'grid', placeItems: 'center', padding: 16 }}>
          <Lottie animationData={loadingAnim} loop style={{ height: 64 }} />
        </div>
      ) : (
        <List>
          {books.map(b => (
            <Item key={b.id}>
              <div>
                <div style={{ fontWeight: 600 }}>{b.title}</div>
                <div style={{ color: '#B9C0CC', fontSize: 13 }}>{b.author || '—'} · {b.genre || '—'} · {b.isbn || '—'} · copies: {b.total_copies}</div>
              </div>
              <Actions>
                <Button type="button" onClick={() => edit(b)}>Edit</Button>
                <Button type="button" onClick={() => destroy(b.id)} style={{ background: '#c34e4e' }}>Delete</Button>
              </Actions>
            </Item>
          ))}
          {/* Pagination controls */}
          {meta && meta.pages > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
              <Button disabled={!meta.prev || loading} onClick={() => fetchBooks((meta.prev as number) || 1)}>Prev</Button>
              {(meta.series || Array.from({ length: meta.pages }, (_, i) => i + 1)).map((it, idx) => {
                const n = typeof it === 'string' ? parseInt(it as string, 10) : (it as number)
                const isCurrent = n === page
                return (
                  <button
                    key={`${it}-${idx}`}
                    onClick={() => fetchBooks(n)}
                    disabled={loading}
                    style={{
                      background: isCurrent ? 'rgba(255,255,255,0.1)' : 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'inherit',
                      padding: '8px 10px',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  >
                    {n}
                  </button>
                )
              })}
              <Button disabled={!meta.next || loading} onClick={() => fetchBooks((meta.next as number) || page)}>Next</Button>
            </div>
          )}
        </List>
      )}

      <BookModal open={open} onClose={() => setOpen(false)} initial={initial} onSaved={fetchBooks} />
    </Section>
  )
}

