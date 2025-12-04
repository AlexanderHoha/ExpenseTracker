import { expensesStore } from "@/stores/expensesStore";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface AddCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onNewCategoryAdded: (categoryName: string) => void;
}

export const AddCategoryModal = observer(({
    visible,
    onClose,
    onNewCategoryAdded
}: AddCategoryModalProps) => {
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleAddNewCategory = () => {
        if (newCategoryName.length == 0) {
            alert('Set category name')
            return;
        }

        expensesStore.addExpenseCategoryRealm({
            name: newCategoryName
        });
    }

    return (
        <Modal
            visible={visible}
            onRequestClose={() => onClose()}
            animationType="slide"
            transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.input}
                        placeholder='Category Name'
                        value={newCategoryName}
                        onChangeText={setNewCategoryName}
                        autoFocus>
                    </TextInput>
                    <Pressable onPress={() => {
                        onClose();
                        handleAddNewCategory();
                    }}>
                        <Text style={{ textAlign: 'center', padding: 15, backgroundColor: '#f5f5f5', margin: 5 }}>Add Category</Text>
                    </Pressable>
                    <Pressable style={styles.cancelButton}
                        onPress={() => {
                            onClose();
                        }}>
                        <Text style={styles.cancelButtonText}>Close</Text>
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
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        padding: 15,
        margin: 15
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});