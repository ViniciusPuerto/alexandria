# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    return unless user.present?

    # Everyone logged-in can read books
    can :read, Book

    if user.librarian?
      can :manage, Book
    else
      cannot :create, Book
      cannot :update, Book
      cannot :destroy, Book
    end
  end
end
