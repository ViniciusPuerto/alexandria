class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: self

  enum :role, { member: 0, librarian: 1 }

  # Simple JWT revocation strategy: denylist all on sign out by tracking jti
  # For API simplicity, we will not persist a denylist table initially; tokens expire quickly.
  # If you need persistent revocation, implement with a Denylist model.
  def self.jwt_revoked?(payload, user)
    false
  end

  def self.revoke_jwt(payload, user)
    # no-op; configure persistent revoke if needed
  end
end
