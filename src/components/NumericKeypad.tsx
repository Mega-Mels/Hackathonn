import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";


type Props = { onPress: (val: string) => void; onClear: () => void };


export default function NumericKeypad({ onPress, onClear }: Props) {
const keys = ["7","8","9","4","5","6","1","2","3","0","."];
return (
<View style={styles.grid}>
{keys.map((k) => (
<TouchableOpacity key={k} style={styles.key} onPress={() => onPress(k)}>
<Text style={styles.keyText}>{k}</Text>
</TouchableOpacity>
))}
<TouchableOpacity style={[styles.key, styles.clear]} onPress={onClear}>
<Text style={styles.keyText}>C</Text>
</TouchableOpacity>
</View>
);
}


const styles = StyleSheet.create({
grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },
key: { width: "30%", aspectRatio: 1, borderRadius: 16, backgroundColor: "#222", alignItems: "center", justifyContent: "center", marginBottom: 12 },
keyText: { color: "#fff", fontSize: 24 },
clear: { backgroundColor: "#3b3b3b" },
});