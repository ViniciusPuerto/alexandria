require 'warden/jwt_auth'

module JwtHelpers
  def jwt_headers_for(user, base_headers = {})
    scope = :user
    encoder = Warden::JWTAuth::UserEncoder.new
    token, _payload = encoder.call(user, scope, nil)
    base = { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }.merge(base_headers)
    base.merge('Authorization' => "Bearer #{token}")
  end
end

RSpec.configure do |config|
  config.include JwtHelpers, type: :request
end

