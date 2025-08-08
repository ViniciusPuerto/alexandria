class BorrowMailer < ApplicationMailer
  default from: "no-reply@alexandria.example"

  def due_soon(borrow_id)
    @borrow = Borrow.find(borrow_id)
    @user = @borrow.user
    @book = @borrow.book
    mail(to: @user.email, subject: "Your borrow is due in 3 days")
  end
end

