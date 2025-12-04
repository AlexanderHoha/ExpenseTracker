import { ExpenseCategoryRealm } from "./expenseCategoryRealm";

export interface ExpenseRealm {
    _id: string;
    amount: number;
    categoryName: ExpenseCategoryRealm;
    date: Date;
}