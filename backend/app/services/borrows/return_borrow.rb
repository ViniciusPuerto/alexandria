module Borrows
  class ReturnBorrow
    class Error < StandardError; end

    def initialize(borrow:, performed_by:)
      @borrow = borrow
      @performed_by = performed_by
    end

    def call
      raise CanCan::AccessDenied unless @performed_by.librarian?
      raise Error, 'Borrow already returned' if @borrow.returned?

      @borrow.update!(returned_at: Time.current)
      @borrow
    end
  end
end

