module Borrows
  class CreateBorrow
    class Error < StandardError; end

    def initialize(user:, book:)
      @user = user
      @book = book
    end

    def call
      raise Error, 'Book not available' unless available_copies_positive?

      now = Time.current
      due = now + 2.weeks

      borrow = Borrow.new(user: @user, book: @book, borrowed_at: now, due_at: due)

      Borrow.transaction do
        if borrow.save
          borrow
        else
          raise Error, borrow.errors.full_messages.to_sentence
        end
      end
    end

    private

    def available_copies_positive?
      active_count = Borrow.active.where(book_id: @book.id).count
      (@book.total_copies - active_count) > 0
    end
  end
end

