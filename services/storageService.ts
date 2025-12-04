import AsyncStorage from "@react-native-async-storage/async-storage";

export class StorageService {
    static async get<T>(key: string): Promise<T | null> {
        try {
            const data = await AsyncStorage.getItem(key);
            if (data) {
                return JSON.parse(data) as T;
            }

            return null;
        } catch (e) {
            console.error(`Failed to load data for key ${key}`, e);
            return null;
        }
    };

    static async save<T>(key: string, data: T) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Failed to save data for key ${key}`, e);
        }
    };

    static async remove(key: string) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error(`Failed to remove data for key ${key}`, e);
        }
    };
};