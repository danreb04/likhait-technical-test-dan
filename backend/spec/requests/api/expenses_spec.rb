require "rails_helper"

RSpec.describe "Api::Expenses", type: :request do
  let!(:food_category) { Category.create!(name: "Food") }
  let!(:transport_category) { Category.create!(name: "Transport") }

  describe "GET /api/expenses" do
    let!(:older_expense) do
      Expense.create!(
        description: "Lunch",
        amount: 100.00,
        category: food_category,
        date: Date.new(2026, 2, 1),
        created_at: Time.zone.parse("2026-02-20 10:00:00")
      )
    end

    let!(:newer_expense) do
      Expense.create!(
        description: "Taxi",
        amount: 50.00,
        category: transport_category,
        date: Date.new(2026, 2, 10),
        created_at: Time.zone.parse("2026-02-19 10:00:00")
      )
    end

    it "returns all expenses with category information" do
      get "/api/expenses"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end

    it "returns expenses in descending order by expense date" do
      get "/api/expenses"

      json = JSON.parse(response.body)
      expect(json.first["id"]).to eq(newer_expense.id)
      expect(json.last["id"]).to eq(older_expense.id)
    end

    it "filters expenses by expense date month/year" do
      get "/api/expenses", params: { year: 2026, month: 2 }

      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end
  end
end
