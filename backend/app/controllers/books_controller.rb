class BooksController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource

  def index
    render json: @books
  end

  def show
    render json: @book
  end

  def create
    if @book.save
      render json: @book, status: :created
    else
      render json: { errors: @book.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @book.update(book_params)
      render json: @book
    else
      render json: { errors: @book.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @book.destroy
    head :no_content
  end

  private

  def book_params
    params.require(:book).permit(:title, :author, :description)
  end
end

