import { ExpenseCategoryRealm } from "./expenseCategoryRealm";

export interface ExpenseRealm {
    _id: string;
    amount: number;
    category: ExpenseCategoryRealm;
    date: Date;
}