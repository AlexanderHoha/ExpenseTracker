import { AddCategoryModal } from '@/components/HomeScreenComponents/AddCategoryModal';
import { AddExpenseButton } from '@/components/HomeScreenComponents/AddExpenseButton';
import { SelectCategoryModal } from '@/components/HomeScreenComponents/SelectCategoryModal';
import { TotalSpentText } from '@/components/HomeScreenComponents/totalSpentText';
import { expensesStore } from '@/stores/expensesStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
  const [selectCategoryModalVisible, selectCategorySetModalVisible] = useState(false);
  const [addCategorymodalVisible, addCategorySetModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    async function init() {
    }

    init();
  }, []);

  return (
    <View style={styles.container}>
      <TotalSpentText />

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

      <SelectCategoryModal
        visible={selectCategoryModalVisible}
        onClose={() => selectCategorySetModalVisible(false)}
        onSelectCategory={(categoryName) => setCategory(categoryName)}
        onAddCategoryPress={() => addCategorySetModalVisible(true)}>
      </SelectCategoryModal>

      <AddCategoryModal
        visible={addCategorymodalVisible}
        onClose={() => {
          addCategorySetModalVisible(false);
          selectCategorySetModalVisible(true);
        }}
        onNewCategoryAdded={(newCategory) => setCategory(newCategory)}>
      </AddCategoryModal>

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
        onPress={() => {
          expensesStore.deleteAllExpenseCategoriesFromRealm();
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