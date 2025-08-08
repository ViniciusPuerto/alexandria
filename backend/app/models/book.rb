class Book < ApplicationRecord
  validates :title, presence: true
  validates :total_copies, numericality: { greater_than_or_equal_to: 0 }

  scope :search, ->(q) do
    next all if q.blank?
    sanitized = ActiveRecord::Base.sanitize_sql_like(q)
    where(<<~SQL, query: sanitized)
      search_vector @@ plainto_tsquery('english', :query)
    SQL
  end
end

