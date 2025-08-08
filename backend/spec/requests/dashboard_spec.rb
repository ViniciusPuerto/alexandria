require 'rails_helper'

RSpec.describe 'Dashboard API', type: :request do
  let(:headers) { { 'CONTENT_TYPE' => 'application/json', 'ACCEPT' => 'application/json' } }
  let(:librarian) { create(:user, :librarian) }
  let(:member1) { create(:user) }
  let(:member2) { create(:user) }

  def auth_headers(user)
    jwt_headers_for(user, headers)
  end

  before do
    Borrow.delete_all
    Book.delete_all
  end

  describe 'GET /dashboard (librarian view when forced)' do
    it 'returns librarian metrics when librarian=true' do
      book1 = create(:book, title: 'Book 1')
      book2 = create(:book, title: 'Book 2')
      book3 = create(:book, title: 'Book 3')

      create(:borrow, user: member1, book: book1, due_at: 1.day.ago) # overdue
      create(:borrow, user: member2, book: book2, due_at: Time.current) # due today
      create(:borrow, user: member2, book: book3, due_at: 1.day.from_now) # active
      create(:borrow, user: member1, book: book2, due_at: 2.days.ago, returned_at: Time.current) # returned, ignored

      get '/dashboard?librarian=true', headers: auth_headers(librarian)
      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)

      expect(body['total_books']).to eq(3)
      expect(body['total_borrowed_books']).to eq(3)
      expect(body['books_due_today']).to eq(1)

      overdue_members = body['overdue_members']
      expect(overdue_members).to be_an(Array)
      expect(overdue_members.any? { |m| m['email'] == member1.email }).to be(true)
      member_entry = overdue_members.find { |m| m['email'] == member1.email }
      expect(member_entry['overdue_borrows']).to be_an(Array)
      expect(member_entry['overdue_borrows'].first['book']['title']).to eq('Book 1')
    end
  end

  describe 'GET /dashboard (librarian without param)' do
    it 'returns member-style payload for librarian without librarian flag' do
      get '/dashboard', headers: auth_headers(librarian)
      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body).to have_key('my_active_borrows')
      expect(body).not_to have_key('total_books')
    end
  end

  describe 'GET /dashboard (member)' do
    it 'returns active and overdue borrows for the member' do
      book1 = create(:book, title: 'Member Book 1')
      book2 = create(:book, title: 'Member Book 2')

      overdue = create(:borrow, user: member1, book: book1, due_at: 1.day.ago)
      _returned = create(:borrow, user: member1, book: book2, due_at: 2.days.ago, returned_at: Time.current)

      get '/dashboard', headers: auth_headers(member1)
      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)

      expect(body['my_active_borrows'].map { |b| b['id'] }).to include(overdue.id)
      expect(body['my_overdue_borrows'].map { |b| b['id'] }).to include(overdue.id)
      # Returned borrow should not be in active
      returned_ids = body['my_active_borrows'].map { |b| b['id'] }
      expect(returned_ids).not_to include(_returned.id)
    end
  end
end

