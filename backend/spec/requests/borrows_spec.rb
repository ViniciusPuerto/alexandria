require 'rails_helper'

RSpec.describe 'Borrows API', type: :request do
  let(:headers) { { 'CONTENT_TYPE' => 'application/json', 'ACCEPT' => 'application/json' } }
  let(:member) { create(:user) }
  let(:librarian) { create(:user, :librarian) }
  let!(:book) { create(:book, total_copies: 2) }

  def auth_headers(user)
    jwt_headers_for(user, headers)
  end

  describe 'POST /borrows' do
    it 'allows a member to borrow when copies available' do
      post '/borrows', params: { book_id: book.id }.to_json, headers: auth_headers(member)
      expect(response).to have_http_status(:created)
      body = JSON.parse(response.body)
      expect(body['book_id']).to eq(book.id)
      expect(body['user_id']).to eq(member.id)
    end

    it 'prevents borrowing the same book twice concurrently' do
      post '/borrows', params: { book_id: book.id }.to_json, headers: auth_headers(member)
      expect(response).to have_http_status(:created)

      post '/borrows', params: { book_id: book.id }.to_json, headers: auth_headers(member)
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'prevents borrowing when no copies available' do
      user2 = create(:user)
      post '/borrows', params: { book_id: book.id }.to_json, headers: auth_headers(member)
      post '/borrows', params: { book_id: book.id }.to_json, headers: auth_headers(user2)

      user3 = create(:user)
      post '/borrows', params: { book_id: book.id }.to_json, headers: auth_headers(user3)
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'POST /borrows/:id/return_book' do
    it 'allows a librarian to mark a borrow as returned' do
      post '/borrows', params: { book_id: book.id }.to_json, headers: auth_headers(member)
      borrow_id = JSON.parse(response.body)['id']

      post "/borrows/#{borrow_id}/return_book", headers: auth_headers(librarian)
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['returned_at']).to be_present
    end

    it 'forbids a member from marking as returned' do
      post '/borrows', params: { book_id: book.id }.to_json, headers: auth_headers(member)
      borrow_id = JSON.parse(response.body)['id']

      post "/borrows/#{borrow_id}/return_book", headers: auth_headers(member)
      expect(response).to have_http_status(:forbidden)
    end
  end
end

