# Seed users and books with Faker

require 'faker'

puts 'Seeding data...'

# Ensure at least one librarian
User.find_or_create_by!(email: 'librarian@example.com') do |u|
  u.password = 'password'
  u.password_confirmation = 'password'
  u.role = :librarian
end

genres = %w[Fantasy Sci-Fi Mystery Thriller Romance Nonfiction Biography History Children Young-Adult]

50.times do
  Book.create!(
    title: Faker::Book.title,
    author: Faker::Book.author,
    genre: genres.sample,
    isbn: Faker::Number.number(digits: 13),
    total_copies: rand(1..15),
    description: Faker::Lorem.paragraph(sentence_count: 3)
  )
end

puts 'Done.'
