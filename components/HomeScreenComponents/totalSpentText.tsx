import { expensesStore } from "@/stores/expensesStore";
import { observer } from "mobx-react-lite";
import { Text } from "react-native";

export const TotalSpentText = observer(() => {
    return (
        <Text style={{position: 'absolute', top: 0, alignItems: 'center', fontSize: 25}}>
            Total Spent: {expensesStore.getTotalSpent()}
        </Text>
    );
});