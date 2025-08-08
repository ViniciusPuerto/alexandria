class Borrow < ApplicationRecord
  belongs_to :user
  belongs_to :book

  validates :borrowed_at, :due_at, presence: true
  validates :book_id, uniqueness: {
    scope: [:user_id],
    conditions: -> { where(returned_at: nil) },
    message: 'already borrowed and not yet returned'
  }

  scope :active, -> { where(returned_at: nil) }

  def returned?
    returned_at.present?
  end
end

