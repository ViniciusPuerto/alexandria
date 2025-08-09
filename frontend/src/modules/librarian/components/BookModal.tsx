import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { api } from '../../../shared/api/client'
import { Button as Btn, Field, Input as Inp, Label } from '../../../shared/components/Form'

export type BookPayload = {
  id?: number
  title: string
  author?: string | null
  description?: string | null
  genre?: string | null
  isbn?: string | null
  total_copies: number
}

const Backdrop = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: grid; place-items: center; z-index: 50;
`

const Modal = styled.div`
  background: ${p => p.theme.colors.surface};
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: ${p => p.theme.radius.lg};
  width: min(720px, 92vw);
  padding: 20px;
`

const Row = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`

const Actions = styled.div`
  display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px;
`

const Button = styled(Btn)`
  width: auto;
`

export const BookModal: React.FC<{
  open: boolean
  onClose: () => void
  initial?: BookPayload | null
  onSaved?: () => void
}> = ({ open, onClose, initial, onSaved }) => {
  const isEdit = Boolean(initial?.id)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [isbn, setIsbn] = useState('')
  const [description, setDescription] = useState('')
  const [total, setTotal] = useState<number>(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || '')
      setAuthor(initial?.author || '')
      setGenre(initial?.genre || '')
      setIsbn(initial?.isbn || '')
      setDescription(initial?.description || '')
      setTotal(initial?.total_copies ?? 0)
      setError(null)
    }
  }, [open, initial])

  if (!open) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!title.trim()) { setError('Title is required'); return }
    if (total < 0) { setError('Total copies must be >= 0'); return }
    try {
      setSaving(true)
      const payload = { book: { title, author, genre, isbn, description, total_copies: total } }
      if (isEdit && initial?.id) {
        await api.patch(`/books/${initial.id}`, payload)
      } else {
        await api.post('/books', payload)
      }
      onSaved?.()
      // notify others (e.g., metrics)
      window.dispatchEvent(new Event('books:changed'))
      onClose()
    } catch (e: any) {
      setError(e?.response?.data?.errors?.join?.(', ') || e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{isEdit ? 'Edit book' : 'New book'}</h3>
        <form onSubmit={submit}>
          <Field>
            <Label htmlFor="title">Title</Label>
            <Inp id="title" value={title} onChange={e => setTitle(e.target.value)} required />
          </Field>
          <Row>
            <Field>
              <Label htmlFor="author">Author</Label>
              <Inp id="author" value={author} onChange={e => setAuthor(e.target.value)} />
            </Field>
            <Field>
              <Label htmlFor="genre">Genre</Label>
              <Inp id="genre" value={genre} onChange={e => setGenre(e.target.value)} />
            </Field>
          </Row>
          <Row>
            <Field>
              <Label htmlFor="isbn">ISBN</Label>
              <Inp id="isbn" value={isbn} onChange={e => setIsbn(e.target.value)} />
            </Field>
            <Field>
              <Label htmlFor="total">Total copies</Label>
              <Inp id="total" type="number" min={0} value={total} onChange={e => setTotal(Number(e.target.value))} />
            </Field>
          </Row>
          <Field>
            <Label htmlFor="description">Description</Label>
            <Inp as="textarea" rows={3 as any} id="description" value={description} onChange={e => setDescription(e.target.value)} />
          </Field>
          {error && <div style={{ color: '#ff8181', marginBottom: 8 }}>{error}</div>}
          <Actions>
            <Button type="button" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>{isEdit ? 'Save changes' : 'Create book'}</Button>
          </Actions>
        </form>
      </Modal>
    </Backdrop>
  )
}

