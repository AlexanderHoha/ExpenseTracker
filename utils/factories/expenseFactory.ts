import { Expense } from "@/types/expense";

export function createExpense(id: number, amount: number, category: string, date: string): Expense {
    return {
        id,
        amount,
        category,
        date
    }
}