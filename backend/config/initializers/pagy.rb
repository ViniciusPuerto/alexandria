# frozen_string_literal: true

require 'pagy/extras/metadata'
require 'pagy/extras/array'

Pagy::DEFAULT[:items] = (ENV.fetch('PAGY_ITEMS', 20).to_i)

