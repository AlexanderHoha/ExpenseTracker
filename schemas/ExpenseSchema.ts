import Realm from "realm";
import { ExpenseCategorySchema } from "./ExpenseCategorySchema";

export class ExpenseSchema extends Realm.Object {
    _id!: Realm.BSON.ObjectId;
    amount!: number;
    category!: ExpenseCategorySchema;
    date!: Date;

    static schema: Realm.ObjectSchema = {
        name: 'Expense',
        primaryKey: '_id',
        properties: {
            _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
            amount: "double",
            category: "ExpenseCategory",
            date: "date",
        }
    }
}