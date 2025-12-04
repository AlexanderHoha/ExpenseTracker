import Realm from "realm";

export class ExpenseCategorySchema extends Realm.Object {
    _id!: Realm.BSON.ObjectId;
    name!: string;

    static schema: Realm.ObjectSchema = {
        name: "ExpenseCategory",
        primaryKey: "_id",
        properties: {
            _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
            name: "string",
        },
    };
}