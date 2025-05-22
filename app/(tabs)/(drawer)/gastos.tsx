import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import { styles } from "./styles";

// Colores personalizados por mes
const MESES_COLORES: Record<string, string> = {
  Enero: "#facc15",
  Febrero: "#f87171",
  Marzo: "#34d399",
  Abril: "#60a5fa",
  Mayo: "#f472b6",
  Junio: "#a78bfa",
  Julio: "#38bdf8",
  Agosto: "#fb923c",
  Septiembre: "#4ade80",
  Octubre: "#fcd34d",
  Noviembre: "#c084fc",
  Diciembre: "#a3e635",
  "No aplica": "#6b7280",
};

const ESTADOS_COLORES: Record<string, string> = {
  Pendiente: "#f97316",
  Pagado: "#10b981",
  "No aplica": "#6b7280",
};

const MESES = Object.keys(MESES_COLORES);
const ESTADOS = Object.keys(ESTADOS_COLORES);

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
  const [menuVisible, setMenuVisible] = useState<{
    id: string;
    campo: "mes" | "estado";
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const refs = useRef<Record<string, any>>({});

  const agregarElemento = () => {
    setGastos([
      ...gastos,
      {
        id: Date.now().toString(),
        elemento: "",
        mes: "No aplica",
        estado: "No aplica",
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

  const openDropdown = (id: string, campo: "mes" | "estado") => {
    if (Platform.OS === "web") {
      const key = `${id}-${campo}`;
      const ref = refs.current[key];
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const dropdownHeight = 240;
        const bottomSpace = window.innerHeight - rect.bottom;
        const top =
          bottomSpace > dropdownHeight
            ? rect.bottom + window.scrollY
            : rect.top + window.scrollY - dropdownHeight;

        setMenuVisible({
          id,
          campo,
          top,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    } else {
      setMenuVisible({ id, campo, top: 0, left: 0, width: 0 });
    }
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

  const renderDropdown = (
    item: Gasto,
    campo: "mes" | "estado",
    opciones: string[]
  ) => {
    const key = `${item.id}-${campo}`;
    const color =
      campo === "mes"
        ? MESES_COLORES[item.mes] || "#f1f5f9"
        : ESTADOS_COLORES[item.estado] || "#f1f5f9";

    return (
      <View
        style={{ position: "relative", flex: 1, marginHorizontal: 2 }}
        ref={(el) => {
          if (Platform.OS === "web") {
            refs.current[key] = el as unknown as HTMLDivElement;
          }
        }}
      >
        <Pressable
          style={[styles.tag, { backgroundColor: color }]}
          onPress={() => openDropdown(item.id, campo)}
        >
          <Text style={styles.tagText}>{item[campo]}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Tablero de Gastos</Text>
        <View style={{ marginTop: 8 }}>
          <Pressable style={styles.boton} onPress={agregarElemento}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              ➕ Nuevo elemento
            </Text>
          </Pressable>
        </View>
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

            {renderDropdown(item, "mes", MESES)}
            {renderDropdown(item, "estado", ESTADOS)}

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

      {menuVisible && (
        <Modal transparent visible animationType="fade">
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setMenuVisible(null)}
          >
            <View
              style={{
                position: "absolute",
                top: menuVisible.top,
                left: menuVisible.left,
                width: menuVisible.width * 2,
                backgroundColor: "white",
                padding: 10,
                borderRadius: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                zIndex: 1000,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {(menuVisible.campo === "mes" ? MESES : ESTADOS).map((op) => (
                  <Pressable
                    key={op}
                    onPress={() => {
                      handleChange(menuVisible.id, menuVisible.campo, op);
                      setMenuVisible(null);
                    }}
                    style={{
                      width: "48%",
                      paddingVertical: 10,
                      paddingHorizontal: 6,
                      marginBottom: 8,
                      borderRadius: 4,
                      backgroundColor:
                        menuVisible.campo === "mes"
                          ? MESES_COLORES[op]
                          : ESTADOS_COLORES[op],
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        textAlign: "center",
                        color: "#1f2937",
                      }}
                    >
                      {op}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <Text style={styles.total}>Total acumulado: ${getTotal()}</Text>
    </View>
  );
}