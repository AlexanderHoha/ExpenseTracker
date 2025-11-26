import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '@/types/expense';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { DEFAULT_EXPENSE_CATEGORIES } from '@/constants/defaultExpenseCategories';
import { ExpenseCategory } from '@/types/expenseCategory';
import { createExpenseCategory } from '@/utils/factories/expenseCategoryFactory';
import { StorageService } from '@/services/storageService';
import { AddExpenseButton } from '@/components/HomeScreenComponents/AddExpenseButton';
import { TotalSpentText } from '@/components/HomeScreenComponents/totalSpentText';

export default function HomeScreen() {
  const [selectCategoryModalVisible, selectCategorySetModalVisible] = useState(false);
  const [addCategorymodalVisible, addCategorySetModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    async function init() {
      const loadedCategories: ExpenseCategory[] = await loadCategories();
      console.log(`trying to set default category, all categories: ${JSON.stringify(loadedCategories)}`)
      setCategory(loadedCategories[0].name);
    }

    init();
  }, []);

  // If no categories in async storage - fill storage with default categories
  const loadCategories = async () => {
    try {
      const existingCategories = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSE_CATEGORIES);
      if (existingCategories) {
        let expenseCategories = JSON.parse(existingCategories) as ExpenseCategory[];
        setCategories(expenseCategories);

        return expenseCategories;
      }

      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSE_CATEGORIES, JSON.stringify(DEFAULT_EXPENSE_CATEGORIES))
      const defaultCategories = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSE_CATEGORIES);
      if (defaultCategories) {
        let expenseCategories = JSON.parse(defaultCategories);
        setCategories(expenseCategories);

        return expenseCategories;
      } else {
        console.error('failed to set default categories');

        return [];
      }
    } catch (e) {
      console.error(`error while setting categories: ${e}`);

      return [];
    }
  }

  return (
    <View style={styles.container}>
      <TotalSpentText/>

      <TextInput
        style={amountTextboxStyles.amountInput}
        placeholder='Input amount'
        keyboardType='numeric'
        onChangeText={(amount) => {
          const numericText = amount.replace(/[^0-9.]/g, '');
          setAmount(numericText);
        }}
        value={amount}
      />

      <Pressable
        style={chooseCategoryButtonStyles.categoryButton}
        onPress={() => selectCategorySetModalVisible(true)}>
        <Text style={chooseCategoryButtonStyles.categoryButtonText}>
          {category}
        </Text>
      </Pressable>

      <Modal
        visible={selectCategoryModalVisible}
        onRequestClose={() => selectCategorySetModalVisible(false)}
        allowSwipeDismissal={true}>
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Choose Category</Text>
            <FlatList
              data={categories.map(category => category.name)}
              keyExtractor={(item: string) => item}
              renderItem={({ item }: { item: string }) =>
                <Pressable
                  style={modalStyles.categoryItem}
                  onPress={() => {
                    selectCategorySetModalVisible(false);
                    setCategory(item);
                  }}
                >
                  <Text style={modalStyles.categoryItemText}>{item}</Text>
                </Pressable>
              }
            />
            <Pressable onPress={() => {
              selectCategorySetModalVisible(false);
              addCategorySetModalVisible(true);
            }}>
              <Text style={{ textAlign: 'center', fontSize: 25 }}>Add category</Text>
            </Pressable>
            <Pressable style={modalStyles.closeButton}
              onPress={() => selectCategorySetModalVisible(false)}>
              <Text style={modalStyles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={addCategorymodalVisible}
        onRequestClose={() => addCategorySetModalVisible(false)}
        allowSwipeDismissal={true}>
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <TextInput style={amountTextboxStyles.amountInput}
              placeholder='Category Name'
              onChangeText={setNewCategoryName}>
            </TextInput>
            <Pressable onPress={async () => {
              const lastCategoryId = Math.max(...categories.map(_ => _.id));
              const categoryToAdd = createExpenseCategory(lastCategoryId + 1, newCategoryName);
              const updatedCategories = [...categories, categoryToAdd];
              setCategories(updatedCategories);
              await AsyncStorage.setItem(STORAGE_KEYS.EXPENSE_CATEGORIES, JSON.stringify(updatedCategories))
              addCategorySetModalVisible(false);
              selectCategorySetModalVisible(true);
            }}>
              <Text style={{ textAlign: 'center' }}>Add Category</Text>
            </Pressable>
            <Pressable style={modalStyles.closeButton}
              onPress={() => {
                addCategorySetModalVisible(false);
                selectCategorySetModalVisible(true);
              }}>
              <Text>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <AddExpenseButton
        amount={amount}
        category={category}
        onPress={() => setAmount('')}>
      </AddExpenseButton>

      <Pressable
        style={clearStorageButtonStyles.clearButton}
        onPress={async () => {
          console.info(`All keys: ${await AsyncStorage.getAllKeys()}`);
          const storedExpenses = await StorageService.get<string>(STORAGE_KEYS.EXPENSES);
          if (storedExpenses) {
            console.info(`storedExpenses: ${JSON.stringify(storedExpenses)}`)
            const parsed: Expense[] = JSON.parse(storedExpenses);
            console.info(`PARSED expenses: ${JSON.stringify(parsed)}`);
          }
          await StorageService.save<Expense[]>(STORAGE_KEYS.EXPENSES, []);
          await StorageService.remove(STORAGE_KEYS.EXPENSES);
        }}>
        <Text style={clearStorageButtonStyles.clearButtonText}>CLEAR LOCAL STORAGE EXPENSES</Text>
      </Pressable>

      <Pressable
        style={clearCategoriesButtonStyles.clearButton}
        onPress={async () => {
          console.info(`All keys: ${await AsyncStorage.getAllKeys()}`);
          const storedCategories = await StorageService.get<string>(STORAGE_KEYS.EXPENSE_CATEGORIES);
          if (storedCategories) {
            console.info(storedCategories)
            const parsed: Expense[] = JSON.parse(storedCategories);
            console.info(`PARSED categories: ${JSON.stringify(parsed)}`);
          }
          await StorageService.remove(STORAGE_KEYS.EXPENSE_CATEGORIES);
        }}>
        <Text style={clearStorageButtonStyles.clearButtonText}>CLEAR LOCAL STORAGE CATEGORIES</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
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

const clearCategoriesButtonStyles = StyleSheet.create({
  clearButton: {
    position: 'absolute',
    bottom: 70,
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