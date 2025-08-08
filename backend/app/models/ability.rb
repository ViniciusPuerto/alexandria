# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    return unless user.present?

    # Everyone logged-in can read books
    can :read, Book

    if user.librarian?
      can :manage, Book
      can :manage, Borrow
      can :return_book, Borrow
    else
      cannot :create, Book
      cannot :update, Book
      cannot :destroy, Book
      can :create, Borrow
      can :read, Borrow, user_id: user.id
      cannot :update, Borrow
      cannot :destroy, Borrow
    end
  end
end
