class CreateBorrows < ActiveRecord::Migration[8.0]
  def change
    create_table :borrows do |t|
      t.references :user, null: false, foreign_key: true
      t.references :book, null: false, foreign_key: true
      t.datetime :borrowed_at, null: false
      t.datetime :due_at, null: false
      t.datetime :returned_at

      t.timestamps
    end

    add_index :borrows, :due_at

    # Prevent a user from having multiple active (not returned) borrows of the same book
    execute <<~SQL
      CREATE UNIQUE INDEX index_borrows_on_user_id_book_id_active
      ON borrows (user_id, book_id)
      WHERE returned_at IS NULL;
    SQL
  end
end

