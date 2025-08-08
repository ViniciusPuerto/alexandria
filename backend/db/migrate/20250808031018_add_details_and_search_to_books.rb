class AddDetailsAndSearchToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :genre, :string
    add_column :books, :isbn, :string
    add_column :books, :total_copies, :integer, null: false, default: 0

    # Add a generated tsvector column for full-text search over title, author, and genre
    execute <<~SQL
      ALTER TABLE books
      ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(author, '') || ' ' || coalesce(genre, ''))
      ) STORED;
    SQL

    # GIN index for fast full-text search
    execute <<~SQL
      CREATE INDEX index_books_on_search_vector ON books USING GIN (search_vector);
    SQL

    add_index :books, :isbn
  end
end
