import { ExpenseCategorySchema } from "@/schemas/ExpenseCategorySchema";
import { ExpenseSchema } from "@/schemas/ExpenseSchema";
import Realm from "realm";

export class RealmService {
    private static realm: Realm | null = null;

    static async initialize(): Promise<Realm> {
        if (this.realm) return this.realm;

        this.realm = await Realm.open({
            schema: [ExpenseSchema, ExpenseCategorySchema],
            schemaVersion: 1,
        });

        return this.realm;
    }

    static getRealm(): Realm {
        if (!this.realm)
            throw new Error('Realm is not initialized');

        return this.realm;
    }
}