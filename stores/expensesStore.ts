import { ExpenseCategorySchema } from "@/schemas/ExpenseCategorySchema";
import { ExpenseSchema } from "@/schemas/ExpenseSchema";
import { ExpenseCategoryRealm } from "@/types/expenseCategoryRealm";
import { ExpenseRealm } from "@/types/expenseRealm";
import { makeAutoObservable, runInAction } from "mobx";
import Realm from "realm";

class ExpensesStore {
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
        this.loadExpensesFromRealm();
    }

    getTotalSpent(): number {
        return this.expensesRealm.reduce((total, expense) => total + expense.amount, 0);
    };

    addExpenseRealm(expense: Omit<ExpenseRealm, '_id'>) {
        if (!this.realm) {
            console.error('Realm is not initialized');
            return;
        }

        try {
            const category = this.realm.objectForPrimaryKey(
                ExpenseCategorySchema,
                new Realm.BSON.ObjectId(expense.category._id),
            );

            this.realm.write(() => {
                this.realm!.create(ExpenseSchema, {
                    _id: new Realm.BSON.ObjectId(),
                    amount: expense.amount,
                    category: category ?? undefined,
                    date: expense.date
                });
            });

            this.loadExpensesFromRealm();
        } catch (e) {
            console.error('Failed to add Expense', e)
        }
    }

    addExpenseCategoryRealm(expenseCategory: Omit<ExpenseCategoryRealm, '_id'>) {
        if (!this.realm) {
            console.error('Realm is not initialized');
            return;
        }

        try {
            this.realm.write(() => {
                this.realm!.create(ExpenseCategorySchema, {
                    _id: new Realm.BSON.ObjectId,
                    name: expenseCategory.name
                })
            });

            this.loadExpenseCategoriesFromRealm();
        } catch (e) {
            console.error('Failed to add Expense category', e)
        }
    }

    getExpenseCategoryByName(name: string): ExpenseCategoryRealm | undefined {
        return this.expenseCategoriesRealm.find(cat => cat.name === name);
    }

    loadExpensesFromRealm() {
        if (!this.realm) {
            console.error('Realm is not initialized');
            return;
        }

        try {
            const existingExpensesRealm = this.realm!.objects(ExpenseSchema);

            runInAction(() => {
                this.expensesRealm = Array.from(existingExpensesRealm).map(expense => ({
                    _id: expense._id.toString(),
                    amount: expense.amount,
                    category: {
                        _id: expense.category._id.toString(),
                        name: expense.category.name
                    },
                    date: expense.date
                }));
            });
        } catch (e) {
            console.error("Failed to load expenses from Realm", e);
        }
    }

    initDefaultCategories() {
        if (!this.realm) {
            console.error('Realm is not initialized');
            return;
        }

        const existingCategories = this.realm.objects<ExpenseCategorySchema>(ExpenseCategorySchema);
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
        if (!this.realm) {
            console.error('Realm is not initialized');
            return;
        }

        try {
            const expenseCategories = this.realm.objects(ExpenseCategorySchema);

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
        if (!this.realm) {
            console.error('Realm is not initialized');
            return;
        }

        this.realm.write(() => {
            const allCategories = this.realm!.objects(ExpenseCategorySchema);
            this.realm!.delete(allCategories);
        });

        runInAction(() => {
            this.expenseCategoriesRealm = [];
        });
    }
};

export const expensesStore = new ExpensesStore();