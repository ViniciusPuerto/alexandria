class BorrowsController < ApplicationController
  before_action :authenticate_user!

  def index
    if current_user.librarian?
      borrows = Borrow.all
      borrows = borrows.where(user_id: params[:user_id]) if params[:user_id].present?
    else
      borrows = current_user.borrows
    end
    render json: borrows
  end

  def create
    authorize! :create, Borrow
    book = Book.find(params.require(:book_id))
    service = Borrows::CreateBorrow.new(user: current_user, book: book)
    borrow = service.call
    render json: borrow, status: :created
  rescue Borrows::CreateBorrow::Error => e
    render json: { errors: [e.message] }, status: :unprocessable_entity
  end

  def return_book
    borrow = Borrow.find(params.require(:id))
    authorize! :return_book, borrow
    service = Borrows::ReturnBorrow.new(borrow: borrow, performed_by: current_user)
    borrow = service.call
    render json: borrow
  rescue Borrows::ReturnBorrow::Error => e
    render json: { errors: [e.message] }, status: :unprocessable_entity
  end
end

