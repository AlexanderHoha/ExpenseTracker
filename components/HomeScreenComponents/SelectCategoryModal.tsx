import { expensesStore } from "@/stores/expensesStore";
import { ExpenseCategoryRealm } from "@/types/expenseCategoryRealm";
import { observer } from "mobx-react-lite";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface SelectCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectCategory: (categoryName: string) => void;
    onAddCategoryPress: () => void;
}

export const SelectCategoryModal = observer(({
    visible,
    onClose,
    onSelectCategory,
    onAddCategoryPress
}: SelectCategoryModalProps) => {
    const { expenseCategoriesRealm } = expensesStore;

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Choose Category</Text>
                    <FlatList<ExpenseCategoryRealm>
                        data={expenseCategoriesRealm}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) =>
                            <Pressable
                                style={styles.categoryItem}
                                onPress={() => {
                                    onSelectCategory(item.name);
                                    onClose();
                                }}
                            >
                                <Text style={styles.categoryItemText}>{item.name}</Text>
                            </Pressable>
                        }
                    />
                    <Pressable
                        style={styles.addCategoryButton}
                        onPress={() => {
                            onClose();
                            onAddCategoryPress();
                        }}>
                        <Text style={styles.addCategoryButtonText}>Add category</Text>
                    </Pressable>
                    <Pressable style={styles.closeButton}
                        onPress={() => onClose()}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
})

const styles = StyleSheet.create({
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
    addCategoryButton: {
        padding: 15,
        marginTop: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
    },
    addCategoryButtonText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    },
    closeButton: {
        marginTop: 10,
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