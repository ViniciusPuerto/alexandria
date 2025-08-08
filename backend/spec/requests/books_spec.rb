require 'rails_helper'

RSpec.describe 'Books API', type: :request do
  let(:headers) { { 'CONTENT_TYPE' => 'application/json', 'ACCEPT' => 'application/json' } }
  let(:member) { create(:user) }
  let(:librarian) { create(:user, :librarian) }

  def auth_headers(user)
    jwt_headers_for(user, headers)
  end

  describe 'GET /books' do
    before do
      Borrow.delete_all
      Book.delete_all
      create_list(:book, 3)
    end

    it 'returns paginated books' do
      get '/books', params: { page: 1, per_page: 3 }, headers: auth_headers(member)
      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body['data'].length).to eq(3)
      expect(body['meta']).to include('page', 'pages')
      expect(body.dig('meta', 'vars', 'items')).to eq(3)
    end
  end

  describe 'POST /books' do
    let(:valid_params) do
      {
        book: {
          title: 'Clean Code',
          author: 'Robert C. Martin',
          genre: 'Nonfiction',
          isbn: '9780132350884',
          total_copies: 5,
          description: 'A Handbook of Agile Software Craftsmanship.'
        }
      }
    end

    it 'forbids members from creating books' do
      post '/books', params: valid_params.to_json, headers: auth_headers(member)
      expect(response).to have_http_status(:forbidden)
    end

    it 'allows librarians to create books' do
      post '/books', params: valid_params.to_json, headers: auth_headers(librarian)
      expect(response).to have_http_status(:created)
      body = JSON.parse(response.body)
      expect(body['title']).to eq('Clean Code')
    end
  end

  describe 'PATCH /books/:id' do
    let!(:book) { create(:book, title: 'Old Title') }

    it 'forbids members from updating books' do
      patch "/books/#{book.id}", params: { book: { title: 'New Title' } }.to_json, headers: auth_headers(member)
      expect(response).to have_http_status(:forbidden)
    end

    it 'allows librarians to update books' do
      patch "/books/#{book.id}", params: { book: { title: 'New Title' } }.to_json, headers: auth_headers(librarian)
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['title']).to eq('New Title')
    end
  end

  describe 'DELETE /books/:id' do
    let!(:book) { create(:book) }

    it 'forbids members from deleting books' do
      delete "/books/#{book.id}", headers: auth_headers(member)
      expect(response).to have_http_status(:forbidden)
    end

    it 'allows librarians to delete books' do
      delete "/books/#{book.id}", headers: auth_headers(librarian)
      expect(response).to have_http_status(:no_content)
    end
  end
end

