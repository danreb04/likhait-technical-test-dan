Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :categories, only: [:index, :create]
    resources :expenses, only: [:index, :create, :update, :destroy]
  end
end
