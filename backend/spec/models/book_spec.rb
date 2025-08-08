require 'rails_helper'

RSpec.describe Book, type: :model do
  it { is_expected.to validate_presence_of(:title) }
  it {
    is_expected.to validate_numericality_of(:total_copies)
      .is_greater_than_or_equal_to(0)
  }

  describe '.search' do
    let!(:book1) { create(:book, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi') }
    let!(:book2) { create(:book, title: 'Foundation', author: 'Isaac Asimov', genre: 'Sci-Fi') }
    let!(:book3) { create(:book, title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance') }

    it 'finds by title' do
      results = described_class.search('Dune')
      expect(results).to include(book1)
      expect(results).not_to include(book2, book3)
    end

    it 'finds by author' do
      results = described_class.search('Asimov')
      expect(results).to include(book2)
      expect(results).not_to include(book1, book3)
    end

    it 'finds by genre' do
      results = described_class.search('Romance')
      expect(results).to include(book3)
      expect(results).not_to include(book1, book2)
    end
  end
end

