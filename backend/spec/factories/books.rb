FactoryBot.define do
  factory :book do
    title { "The Pragmatic Programmer" }
    author { "Andrew Hunt" }
    genre { "Nonfiction" }
    sequence(:isbn) { |n| "978013595705#{n % 10}" }
    total_copies { 3 }
    description { "A classic book on pragmatic software development." }
  end
end

