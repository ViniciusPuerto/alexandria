module Accessible
  extend ActiveSupport::Concern

  included do
    respond_to :json
  end
end

