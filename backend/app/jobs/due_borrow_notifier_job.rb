class DueBorrowNotifierJob < ApplicationJob
  queue_as :default

  def perform
    window_start = 3.days.from_now.beginning_of_day
    window_end = 3.days.from_now.end_of_day

    Borrow.active.where(due_at: window_start..window_end).find_each do |borrow|
      BorrowMailer.due_soon(borrow.id).deliver_later
    end
  end
end

