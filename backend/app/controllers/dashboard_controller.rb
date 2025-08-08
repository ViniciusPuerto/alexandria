class DashboardController < ApplicationController
  before_action :authenticate_user!

  def show
    if current_user.librarian? && params[:librarian] == 'true'
      render json: librarian_dashboard
    else
      render json: member_dashboard
    end
  end

  private

  def librarian_dashboard
    now = Time.current
    {
      total_books: Book.count,
      total_borrowed_books: Borrow.active.count,
      books_due_today: Borrow.active.where(due_at: now.beginning_of_day..now.end_of_day).count,
      overdue_members: overdue_members_payload
    }
  end

  def overdue_members_payload
    overdue = Borrow.active.where('due_at < ?', Time.current).includes(:user, :book)
    grouped = overdue.group_by(&:user)
    grouped.map do |user, borrows|
      {
        id: user.id,
        email: user.email,
        overdue_borrows: borrows.map do |b|
          {
            id: b.id,
            due_at: b.due_at,
            book: { id: b.book_id, title: b.book.title }
          }
        end
      }
    end
  end

  def member_dashboard
    active = current_user.borrows.active.includes(:book)
    overdue = active.select { |b| b.due_at < Time.current }
    {
      my_active_borrows: active.map { |b| borrow_payload(b) },
      my_overdue_borrows: overdue.map { |b| borrow_payload(b) }
    }
  end

  def borrow_payload(borrow)
    {
      id: borrow.id,
      borrowed_at: borrow.borrowed_at,
      due_at: borrow.due_at,
      returned_at: borrow.returned_at,
      book: { id: borrow.book_id, title: borrow.book.title }
    }
  end
end

