import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
// Import polyfills first
import './src/polyfills';
import CalculatorScreen from "./src/screens/CalculatorScreen";
import AppNavigator from "./AppNavigator";

const SECRET_PIN = "3179";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [unlocked, setUnlocked] = useState(false);

  const onDigit = (d: string) => {
    if (unlocked) return;
    const next = display === "0" ? d : display + d;
    setDisplay(next);
    if (next.endsWith(SECRET_PIN)) {
      setUnlocked(true);
      setDisplay("0");
    }
  };

  const onClear = () => setDisplay("0");
  const quickExit = () => {
    setUnlocked(false);
    setDisplay("0");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      <StatusBar style="light" />
      {!unlocked ? (
        <CalculatorScreen value={display} onDigit={onDigit} onClear={onClear} />
      ) : (
        <AppNavigator onClose={quickExit} />
      )}
    </SafeAreaView>
  );
}
