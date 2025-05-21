import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { styles } from "./styles";

type Gasto = {
  id: string;
  elemento: string;
  mes: string;
  estado: string;
  fecha: Date | null;
  gasto: string;
};

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const ESTADOS = ["Pendiente", "Pagado", "No aplica"];

export default function GastosScreen() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [editandoCampo, setEditandoCampo] = useState<{
    id: string;
    campo: "mes" | "estado" | null;
  } | null>(null);

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

  const getTotal = () =>
    gastos.reduce((acc, curr) => acc + parseFloat(curr.gasto || "0"), 0);

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

  const renderSelect = (
    item: Gasto,
    campo: "mes" | "estado",
    opciones: string[],
    color: string
  ) => {
    const isEditing =
      editandoCampo?.id === item.id && editandoCampo.campo === campo;

    if (isEditing || !item[campo]) {
      return (
        <View style={styles.pickerCell}>
          <select
            value={item[campo]}
            onChange={(e) => {
              handleChange(item.id, campo, e.target.value);
              setEditandoCampo(null);
            }}
            onBlur={() => setEditandoCampo(null)}
            style={{
              backgroundColor: "#f1f5f9",
              borderRadius: 6,
              padding: 6,
              width: "100%",
              border: "none",
              textAlign: "center",
              fontWeight: "bold",
              color: "#1f2937",
            }}
          >
            <option value="">Selecciona</option>
            {opciones.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </View>
      );
    }

    return (
      <Pressable
        style={[styles.tag, { backgroundColor: color }]}
        onPress={() => setEditandoCampo({ id: item.id, campo })}
      >
        <Text style={styles.tagText}>{item[campo]}</Text>
      </Pressable>
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
              placeholderTextColor="#64748b"
            />

            {renderSelect(item, "mes", MESES, "#fbbf24")}
            {renderSelect(
              item,
              "estado",
              ESTADOS,
              item.estado === "Pagado"
                ? "#10b981"
                : item.estado === "No aplica"
                ? "#6b7280"
                : "#f97316"
            )}

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
                style={{ flex: 1, textAlign: "right", color: "#1f2937" }}
                placeholder="0"
                keyboardType="numeric"
                value={item.gasto}
                onChangeText={(text) => handleChange(item.id, "gasto", text)}
                placeholderTextColor="#64748b"
              />
              <Text style={{ marginLeft: 4, fontWeight: "bold" }}>$</Text>
            </View>
          </View>
        )}
      />

      <Text style={styles.total}>Total acumulado: ${getTotal()}</Text>
    </View>
  );
}