class Book < ApplicationRecord
  has_many :borrows, dependent: :restrict_with_error
  validates :title, presence: true
  validates :total_copies, numericality: { greater_than_or_equal_to: 0 }

  scope :search, ->(q) do
    next all if q.blank?
    sanitized = ActiveRecord::Base.sanitize_sql_like(q)
    where(<<~SQL, query: sanitized)
      search_vector @@ plainto_tsquery('english', :query)
    SQL
  end

  def available_copies
    total_copies - borrows.active.count
  end
end

