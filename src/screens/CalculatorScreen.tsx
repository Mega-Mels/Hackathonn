import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

type Props = {
  value: string;
  onDigit: (d: string) => void;
  onClear: () => void;
};

const CalculatorScreen: React.FC<Props> = ({ value, onDigit, onClear }) => {
  const buttons = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const handleButtonPress = (button: string) => {
    if (button === "C") {
      onClear();
    } else {
      onDigit(button);
    }
  };

  const getButtonStyle = (button: string) => {
    if (button === "C") return styles.clearButton;
    if (["÷", "×", "-", "+", "="].includes(button)) return styles.operationButton;
    if (button === "0") return styles.zeroButton;
    if (["±", "%"].includes(button)) return styles.functionButton;
    return styles.digitButton;
  };

  const getButtonTextStyle = (button: string) => {
    if (["C", "±", "%"].includes(button)) return styles.functionButtonText;
    if (["÷", "×", "-", "+", "="].includes(button)) return styles.operationButtonText;
    return styles.digitButtonText;
  };

  return (
    <View style={styles.container}>
      {/* Display Area */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1}>
          {value || "0"}
        </Text>
      </View>
      
      {/* Buttons Grid */}
      <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button) => (
              <TouchableOpacity
                key={button}
                style={[styles.button, getButtonStyle(button)]}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.7}
              >
                <Text style={getButtonTextStyle(button)}>
                  {button}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;
const buttonSize = screenWidth / 4 - 15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  displayContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "flex-end",
    marginBottom: 10,
  },
  displayText: {
    color: "#fff",
    fontSize: 70,
    fontWeight: "300",
  },
  buttonsContainer: {
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  digitButton: {
    backgroundColor: "#333333",
  },
  digitButtonText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "400",
  },
  zeroButton: {
    width: buttonSize * 2 + 10,
    backgroundColor: "#333333",
    alignItems: "flex-start",
    paddingLeft: 30,
  },
  operationButton: {
    backgroundColor: "#FF9F0A",
  },
  operationButtonText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "500",
  },
  functionButton: {
    backgroundColor: "#A5A5A5",
  },
  functionButtonText: {
    color: "#000",
    fontSize: 28,
    fontWeight: "500",
  },
  clearButton: {
    backgroundColor: "#A5A5A5",
  },
});

export default CalculatorScreen;