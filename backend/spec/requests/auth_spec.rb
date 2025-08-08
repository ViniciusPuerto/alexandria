require 'rails_helper'

RSpec.describe 'Auth', type: :request do
  let(:headers) { { 'CONTENT_TYPE' => 'application/json', 'ACCEPT' => 'application/json' } }

  it 'registers a user and returns a token' do
    post '/users', params: { user: { email: 'new@example.com', password: 'password', password_confirmation: 'password' } }.to_json, headers: headers
    # debug
    puts "register status=#{response.status} body=#{response.body}"
    expect(response).to have_http_status(:created)
    body = JSON.parse(response.body)
    expect(body['token']).to be_present
  end

  it 'logs in a user and returns a token' do
    user = create(:user)
    post '/users/sign_in', params: { user: { email: user.email, password: 'password' } }.to_json, headers: headers
    puts "login status=#{response.status} body=#{response.body}"
    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body['token']).to be_present
  end
end

