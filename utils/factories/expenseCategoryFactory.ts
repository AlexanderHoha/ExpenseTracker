import { ExpenseCategory } from "@/types/expenseCategory";

export function createExpenseCategory(id : number, name : string) : ExpenseCategory{
    return {
        id,
        name
    }
}