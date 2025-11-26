import { expensesStore } from "@/stores/expensesStore";
import { DateUtils } from "@/utils/dateUtils";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FlatList, RefreshControl, View, StyleSheet, Text } from "react-native";

export const ExpenseList = observer(() => {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await expensesStore.loadExpensesFromStorage();
        setRefreshing(false);
    }

    return (
        <FlatList
            style={{ flex: 1, }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={[...expensesStore.expenses].reverse()}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}>
                </RefreshControl>
            }
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text>{item.amount}</Text>
                    <Text>{item.category}</Text>
                    <Text>{DateUtils.toDateString(item.date)}</Text>
                </View>
            )}>
        </FlatList>
    );
});

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  text: {
    flex: 1,
    textAlign: 'center'
  },
});