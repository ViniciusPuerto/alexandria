RSpec.configure do |config|
  config.before(type: :request) do
    host! 'www.example.com'
  end
end

