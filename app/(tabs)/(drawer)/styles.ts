import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
    backgroundColor: "#1F2533",
  },
  headerRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  boton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#2C3343",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  header: {
    borderBottomWidth: 1,
    borderColor: "#555",
    paddingBottom: 6,
    backgroundColor: "#2C3343",
    borderRadius: 6,
  },
  cell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    color: "#cbd5e1",
  },
  inputCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 2,
    textAlign: "center",
    backgroundColor: "#f1f5f9",
  },
  pickerCell: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
  },
  tag: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginHorizontal: 2,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  tagText: {
    fontWeight: "600",
    textAlign: "center",
  },
  total: {
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    color: "white",
  },
});
