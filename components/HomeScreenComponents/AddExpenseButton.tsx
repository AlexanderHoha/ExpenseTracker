import { expensesStore } from "@/stores/expensesStore";
import { observer } from "mobx-react-lite";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

interface AddExpenseButtonProps {
    amount: string;
    category: string;
    onPress: () => void;
}

export const AddExpenseButton = observer((
    {
        amount,
        category,
        onPress
    }: AddExpenseButtonProps
) => {
    const handleAddExpense = () => {
        if (!amount || !category) {
            Alert.alert('Fill all fields')
            return;
        }

        const expenseCategory = expensesStore.getExpenseCategoryByName(category);
        if (expenseCategory) {
            expensesStore.addExpenseRealm({
                amount: parseFloat(amount),
                category: expenseCategory,
                date: new Date()
            }
            );
            onPress();
        } else {
            console.error('Failed to add expense')
        }
    };

    return (
        <Pressable
            style={addExpenseButtonStyles.addButton}
            onPress={handleAddExpense}>
            <Text style={addExpenseButtonStyles.addButtonText}>Add Expense</Text>
        </Pressable>
    );
});

const addExpenseButtonStyles = StyleSheet.create({
    addButton: {
        backgroundColor: '#0a7ea4',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});