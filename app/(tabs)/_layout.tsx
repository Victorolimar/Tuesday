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
          <Text style={styles.linkText}>Gastos</Text>
        </Pressable>
        <Pressable style={styles.link} onPress={() => router.push("/two")}>
          <Text style={styles.linkText}>Ingresos</Text>
        </Pressable>
        <Pressable style={styles.link} onPress={() => router.push("/")}>
          <Text style={styles.linkText}>Deudas</Text>
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
    backgroundColor: "#1F2533", // mismo color que el fondo de gastos
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f1f5f9",
    marginBottom: 20,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: "#2C3343", // ligeramente más claro
  },
  linkText: {
    color: "#f1f5f9",
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1F2533", // para mantener consistencia visual
  },
});