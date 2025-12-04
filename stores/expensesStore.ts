import { STORAGE_KEYS } from "@/constants/storageKeys";
import { ExpenseCategorySchema } from "@/schemas/ExpenseCategorySchema";
import { StorageService } from "@/services/storageService";
import { Expense } from "@/types/expense";
import { ExpenseCategoryRealm } from "@/types/expenseCategoryRealm";
import { ExpenseRealm } from "@/types/expenseRealm";
import { makeAutoObservable, runInAction } from "mobx";
import Realm from "realm";

class ExpensesStore {
    expenses: Expense[] = [];
    expensesRealm: ExpenseRealm[] = [];
    expenseCategoriesRealm: ExpenseCategoryRealm[] = [];
    private realm: Realm | null = null;

    constructor() {
        makeAutoObservable(this);
    };

    setRealm(realm: Realm) {
        this.realm = realm;
        this.initDefaultCategories();
        this.loadExpenseCategoriesFromRealm();
    }

    // addExpenseRealm(expense: Omit<Expense, '_id'>) {
    //     
    // }

    addExpenseCategoryRealm(expenseCategory: Omit<ExpenseCategoryRealm, '_id'>) {
        this.realm?.write(() => {
            this.realm?.create(ExpenseCategorySchema, {
                _id: new Realm.BSON.ObjectId,
                name: expenseCategory.name
            })
        });

        this.loadExpenseCategoriesFromRealm();
    }

    loadExpensesFromRealm() {

    }

    initDefaultCategories() {
        const existingCategories = this.realm!.objects<ExpenseCategorySchema>(ExpenseCategorySchema);
        if (existingCategories.length > 0) return;

        const defaultCategories = [
            'Food', 'Leisure', 'Medicine', 'Other'
        ];

        this.realm?.write(() => {
            defaultCategories.forEach(categoryName => {
                this.realm!.create('ExpenseCategory', {
                    _id: new Realm.BSON.ObjectID(),
                    name: categoryName
                });
            })
        });

        this.loadExpenseCategoriesFromRealm();
    }

    loadExpenseCategoriesFromRealm() {
        try {
            const expenseCategories = this.realm!.objects<ExpenseCategorySchema>(ExpenseCategorySchema);

            runInAction(() => {
                this.expenseCategoriesRealm = Array.from(expenseCategories).map(category => ({
                    _id: category._id.toString(),
                    name: category.name,
                }));
            })
        } catch (e) {
            console.error("Failed to load expense categories from Realm", e);
        }
    }

    deleteAllExpenseCategoriesFromRealm() {
        this.realm!.write(() => {
            const allCategories = this.realm!.objects(ExpenseCategorySchema);
            this.realm!.delete(allCategories);
        });

        runInAction(() => {
            this.expenseCategoriesRealm = [];
        });
    }


    addExpense(expense: Expense) {
        this.expenses.push(expense);
        this.saveExpansesToStorage();
        console.log("Expense added:", expense);
        console.log(`All expenses:`, JSON.stringify(this.expenses));
    };

    getTotalSpent(): number {
        return this.expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    async saveExpansesToStorage() {
        try {
            await StorageService.save(STORAGE_KEYS.EXPENSES, this.expenses);
        } catch (e) {
            console.error("Failed to save expenses to storage", e);
        }
    };

    async loadExpensesFromStorage() {
        try {
            const expenses = await StorageService.get<Expense[]>(STORAGE_KEYS.EXPENSES);
            if (expenses) {
                this.expenses = expenses;
            }
        } catch (e) {
            console.error("Failed to load expenses from storage", e);
        }
    };
};

export const expensesStore = new ExpensesStore();