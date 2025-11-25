import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import React, { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Expense } from "@/types/expense";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { toDateString } from "@/utils/factories/dateUtils";

export default function HistoryScreen() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadExpenses();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadExpenses();
        setRefreshing(false);
    }

    const loadExpenses = async () => {
        try {
            const storedExpenses = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
            console.info(`stored: ${storedExpenses}`)
            if (storedExpenses) {
                const parsed: Expense[] = JSON.parse(storedExpenses);
                console.info(`stored expenses: ${JSON.stringify(parsed)}`);
                setExpenses(parsed);
            }
        } catch (error) {
            console.error('Error while loading expenses');
        }
    }

    return (
        <View
            style={styles.container}>
            <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'center', fontSize: 25 }}>Expense history</Text>
                <View style={{ flex: 2 }}>
                    <FlatList
                    style={expensesFlatListStyles.container}
                        contentContainerStyle={{ alignItems: 'stretch' }}
                        data={expenses}
                        keyExtractor={(item) => item.id.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}>
                            </RefreshControl>
                        }
                        renderItem={({ item }) => (
                            <View style={expenseItemStyles.item}>
                                <Text style={{ justifyContent: 'space-around' }}>
                                    {item.amount} | {item.category} | {toDateString(item.date)}
                                </Text>
                            </View>
                        )}>
                    </FlatList>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    }
});

const expensesFlatListStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 0
    },
});

const expenseItemStyles = StyleSheet.create({
    item: {
        padding: 14,
        borderRadius: 8,
        fontSize: 16,
    }
});