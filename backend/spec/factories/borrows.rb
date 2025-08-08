FactoryBot.define do
  factory :borrow do
    association :user
    association :book
    borrowed_at { Time.current }
    due_at { 2.weeks.from_now }
    returned_at { nil }
  end
end

