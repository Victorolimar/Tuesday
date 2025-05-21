import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Tipo para cada fila de gasto
type Gasto = {
  id: string;
  elemento: string;
  mes: string;
  estado: string;
  fecha: Date | null;
  gasto: string;
};

export default function GastosScreen() {
  const [gastos, setGastos] = useState<Gasto[]>([]);

  const agregarElemento = () => {
    setGastos([
      ...gastos,
      {
        id: Date.now().toString(),
        elemento: "",
        mes: "",
        estado: "",
        fecha: null,
        gasto: "",
      },
    ]);
  };

  const handleChange = (
    id: string,
    campo: keyof Gasto,
    valor: string | Date
  ) => {
    const nuevos = gastos.map((item) =>
      item.id === id ? { ...item, [campo]: valor } : item
    );
    setGastos(nuevos);
  };

  const getTotal = () => {
    return gastos.reduce((acc, curr) => acc + parseFloat(curr.gasto || "0"), 0);
  };

  const renderFecha = (item: Gasto) => {
    const isWeb = Platform.OS === "web";

    const fechaTexto = item.fecha ? item.fecha.toLocaleDateString() : "";

    const handleFechaChange = (e: any) => {
      const value = e.target.value;
      const nuevaFecha = new Date(value);
      if (!isNaN(nuevaFecha.getTime())) {
        handleChange(item.id, "fecha", nuevaFecha);
      }
    };

    if (isWeb) {
      return (
        <View style={styles.inputCell}>
          <input
            type="date"
            value={item.fecha ? item.fecha.toISOString().split("T")[0] : ""}
            onChange={handleFechaChange}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              textAlign: "center",
              fontSize: 14,
              height: "100%",
              backgroundColor: "transparent",
            }}
          />
        </View>
      );
    }

    return (
      <TextInput
        style={styles.inputCell}
        placeholder="Seleccionar fecha"
        value={fechaTexto}
        editable={false}
        onTouchStart={() =>
          alert("El selector de fecha para móvil aún no está implementado.")
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Tablero de Gastos</Text>
        <Pressable style={styles.boton} onPress={agregarElemento}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            ➕ Nuevo elemento
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={gastos}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={[styles.row, styles.header]}>
            <Text style={styles.cell}>Elemento</Text>
            <Text style={styles.cell}>Mes</Text>
            <Text style={styles.cell}>Estado</Text>
            <Text style={styles.cell}>Fecha</Text>
            <Text style={styles.cell}>Gasto</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TextInput
              style={styles.inputCell}
              placeholder="Concepto"
              value={item.elemento}
              onChangeText={(text) => handleChange(item.id, "elemento", text)}
            />
            <Picker
              selectedValue={item.mes}
              style={styles.pickerCell}
              onValueChange={(value) => handleChange(item.id, "mes", value)}
            >
              <Picker.Item label="Mes" value="" />
              {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes) => (
                <Picker.Item key={mes} label={mes} value={mes} />
              ))}
            </Picker>

            <Picker
              selectedValue={item.estado}
              style={styles.pickerCell}
              onValueChange={(value) => handleChange(item.id, "estado", value)}
            >
              <Picker.Item label="Estado" value="" />
              <Picker.Item label="Pendiente" value="pendiente" />
              <Picker.Item label="Pagado" value="pagado" />
            </Picker>

            {renderFecha(item)}

            <View
              style={[
                styles.inputCell,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              ]}
            >
              <TextInput
                style={{ flex: 1, textAlign: "right" }}
                placeholder="0"
                keyboardType="numeric"
                value={item.gasto}
                onChangeText={(text) => handleChange(item.id, "gasto", text)}
              />
              <Text style={{ marginLeft: 4 }}>$</Text>
            </View>
          </View>
        )}
      />

      <Text
        style={{
          textAlign: "right",
          fontSize: 16,
          fontWeight: "bold",
          marginTop: 12,
        }}
      >
        Total acumulado: ${getTotal()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  boton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  row: { flexDirection: "row", marginBottom: 8, alignItems: "center" },
  header: { borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 4 },
  cell: { flex: 1, fontWeight: "bold", textAlign: "center" },
  inputCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 6,
    borderRadius: 4,
    marginHorizontal: 2,
    textAlign: "center",
  },
  pickerCell: {
    flex: 1,
    marginHorizontal: 2,
  },
});