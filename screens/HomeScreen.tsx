import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '@/types/expense';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { DEFAULT_EXPENSE_CATEGORIES } from '@/constants/defaultExpenseCategories';
import { ExpenseCategory } from '@/types/expenseCategory';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  let Categories = ['Food', 'Leisure', 'Other']

  useEffect(() => {
    loadExpenses();
    setCategory(Categories[0]);
  }, []);

  const loadExpenses = async () => {
    try {
      const expenses = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (expenses) {
        setExpenses(JSON.parse(expenses));
      }
    } catch (error) {
      console.error('Error while loading expenses', error)
    }
  };

  useEffect(() => {
    saveExpenses();
  }, [expenses]);

  const saveExpenses = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses))
    } catch (error) {
      console.error('Error while saving expenses', error)
    }
  };

  const handleAddExpense = () => {
    if (!amount || !category) {
      alert('Fill all fields')
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      amount: parseFloat(amount),
      category: category,
      date: new Date()
    }

    setExpenses([...expenses, newExpense]);
    setAmount('');
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={amountTextboxStyles.amountInput}
        placeholder="Input amount"
        keyboardType="numeric"
        onChangeText={setAmount}
        value={amount}
      />

      <Pressable
        style={chooseCategoryButtonStyles.categoryButton}
        onPress={() => setModalVisible(true)}>
        <Text style={chooseCategoryButtonStyles.categoryButtonText}>
          {category}
        </Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        allowSwipeDismissal={true}>
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Choose Category</Text>
            <FlatList
              data={Categories}
              keyExtractor={(item: string) => item}
              renderItem={({ item } : { item : string }) =>
                <Pressable
                  style={modalStyles.categoryItem}
                  onPress={() => {
                    setModalVisible(false);
                    setCategory(item);
                  }}
                >
                  <Text style={modalStyles.categoryItemText}>{item}</Text>
                </Pressable>
              }
            />
            <Pressable style={modalStyles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={modalStyles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Pressable
        style={addExpenseButtonStyles.addButton}
        onPress={handleAddExpense}>
        <Text style={addExpenseButtonStyles.addButtonText}>Add Expense</Text>
      </Pressable>

      <Pressable
        style={clearStorageButtonStyles.clearButton}
        onPress={async () => {
          console.log(`All keys: ${await AsyncStorage.getAllKeys()}`);
          const storedExpenses = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
          if (storedExpenses) {
            console.log(storedExpenses)
            const parsed: Expense[] = JSON.parse(storedExpenses);
            console.log(`PARSED: ${parsed}`);
          }
          await AsyncStorage.removeItem(STORAGE_KEYS.EXPENSES);
        }}>
        <Text style={clearStorageButtonStyles.clearButtonText}>CLEAR LOCAL STORAGE</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

const amountTextboxStyles = StyleSheet.create({
  amountInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    width: '100%',
  },
});

const chooseCategoryButtonStyles = StyleSheet.create({
  categoryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#333',
  },
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

const clearStorageButtonStyles = StyleSheet.create({
  clearButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
});