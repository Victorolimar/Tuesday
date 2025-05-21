import { View, Text, Pressable, StyleSheet } from "react-native";
import { Slot, useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <Text style={styles.title}>📋 Menú</Text>
        <Pressable style={styles.link} onPress={() => router.push("/gastos")}>
          <Text>Gastos</Text>
        </Pressable>
        <Pressable style={styles.link} onPress={() => router.push("/two")}>
          <Text>Ingresos</Text>
        </Pressable>
        <Pressable style={styles.link} onPress={() => router.push("/")}>
          <Text>Deudas</Text>
        </Pressable>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  sidebar: {
    width: 220,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  link: {
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});