import { Expense, ExpenseFormData } from "../types";

const API_BASE_URL = "http://localhost:3000/api";

export interface Category {
  id: number;
  name: string;
}

export async function fetchExpenses(): Promise<Expense[]> {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  if (!response.ok) throw new Error("Failed to fetch expenses");
  return response.json();
}

export async function getExpenses(
  year: number,
  month: number,
): Promise<Expense[]> {
  const response = await fetch(
    `${API_BASE_URL}/expenses?year=${year}&month=${month}`,
  );
  if (!response.ok) throw new Error("Failed to fetch expenses");
  return response.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

export async function createCategory(name: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category: { name },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.join(", ") || "Failed to create category");
  }

  return data;
}

async function resolveCategoryId(categoryName: string): Promise<number> {
  const categories = await fetchCategories();
  const category = categories.find((c) => c.name === categoryName);

  if (!category) {
    throw new Error("Selected category not found");
  }

  return category.id;
}

export async function createExpense(data: ExpenseFormData): Promise<Expense> {
  const category_id = await resolveCategoryId(data.category);

  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expense: {
        description: data.description,
        amount: data.amount,
        category_id,
        date: data.date,
      },
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.join(", ") || "Failed to create expense");
  }

  return result;
}

export async function updateExpense(
  id: number,
  data: Partial<ExpenseFormData>,
): Promise<Expense> {
  const payload: Record<string, unknown> = {
    description: data.description,
    amount: data.amount,
    date: data.date,
  };

  if (data.category) {
    payload.category_id = await resolveCategoryId(data.category);
  }

  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expense: payload }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.join(", ") || "Failed to update expense");
  }

  return result;
}

export async function deleteExpense(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete expense");
  }
}
