import { ExpenseList } from "@/components/ExpenseHistoryScreenComponents/ExpenseList";
import { StyleSheet, Text, View, } from "react-native";

export default function HistoryScreen() {
    return (
        <View
            style={styles.container}>
            <Text style={{ textAlign: 'center', fontSize: 25 }}>Expense history</Text>
            <View style={{ flex: 1 }}>
                <ExpenseList />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    }
});