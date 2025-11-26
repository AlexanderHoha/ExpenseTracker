import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

export function LoadingScreen() {
  return (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Loading</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    marginTop: 15,
    fontSize: 18,
    color: '#333',
  },
});