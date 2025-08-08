RSpec.configure do |config|
  config.include Warden::Test::Helpers, type: :request

  config.before(type: :request) do
    Warden.test_mode!
  end

  config.after(type: :request) do
    Warden.test_reset!
  end
end

