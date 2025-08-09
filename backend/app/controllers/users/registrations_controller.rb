class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    build_resource(sign_up_params)

    resource.save
    if resource.persisted?
      # Avoid writing to the session in API-only mode
      sign_in(resource_name, resource, store: false)
      render json: {
        user: { id: resource.id, email: resource.email, role: resource.role },
        token: request.env['warden-jwt_auth.token']
      }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        user: { id: resource.id, email: resource.email, role: resource.role },
        token: request.env['warden-jwt_auth.token']
      }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end
end

