import { STORAGE_KEYS } from "@/constants/storageKeys";
import { StorageService } from "@/services/storageService";
import { Expense } from "@/types/expense";
import { makeAutoObservable } from "mobx";

class ExpensesStore {
    expenses: Expense[] = [];

    constructor() {
        makeAutoObservable(this);
    };

    addExpense(expense: Expense) {
        this.expenses.push(expense);
        this.saveExpansesToStorage();
        console.log("Expense added:", expense);
        console.log(`All expenses:`, JSON.stringify(this.expenses));
    };

    getTotalSpent() : number {
        return this.expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    async saveExpansesToStorage() {
        try {
            await StorageService.save(STORAGE_KEYS.EXPENSES, this.expenses);
        }catch (e){
            console.error("Failed to save expenses to storage", e);
        }
    };

    async loadExpensesFromStorage() {
        try {
            const expenses = await StorageService.get<Expense[]>(STORAGE_KEYS.EXPENSES);
            if (expenses) {
                this.expenses = expenses;
            }
        }catch (e){
            console.error("Failed to load expenses from storage", e);
        }
    };
};

export const expensesStore = new ExpensesStore();