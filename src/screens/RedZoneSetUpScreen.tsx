import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';

const RedZoneSetupScreen = () => {
  const [redZoneLocation, setRedZoneLocation] = useState<string | null>(null);
  const [finalDestination, setFinalDestination] = useState<string | null>(null);
  const [minutesToSafety, setMinutesToSafety] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const hardcodedLocations = [
    "Khayelitsha",
    "Nyanga",
    "Gugulethu",
    "Mitchells Plain",
    "Langa",
  ];

  const handleEnableRedZone = () => {
    if (!redZoneLocation || !finalDestination || !minutesToSafety) {
      Alert.alert("Missing Information", "Please fill all fields to enable the Red Zone!");
      return;
    }

    Alert.alert(
      "Red Zone Enabled!",
      `Your safety timer has been set:\n\nFrom: ${redZoneLocation}\nTo: ${finalDestination}\nTime to safety: ${minutesToSafety} minutes`,
      [
        { 
          text: "OK", 
          onPress: () => {
            setIsEnabled(true);
          }
        }
      ]
    );
  };

  const handleSafeConfirmation = () => {
    Alert.alert(
      "Tracking Stopped",
      "You have safely reached your destination. Tracking has been stopped.",
      [
        {
          text: "OK",
          onPress: () => {
            setIsEnabled(false);
            setRedZoneLocation(null);
            setFinalDestination(null);
            setMinutesToSafety("");
          }
        }
      ]
    );
  };

  // Show the safety confirmation screen if red zone is enabled
  if (isEnabled) {
    return (
      <View style={styles.safetyContainer}>
        <View style={styles.safetyContent}>
          <Text style={styles.safetyTitle}>You're in a Red Zone</Text>
          <Text style={styles.safetySubtitle}>
            Traveling from {redZoneLocation} to {finalDestination}
          </Text>
          
          <View style={styles.safetyTimerContainer}>
            <Text style={styles.safetyTimerText}>{minutesToSafety}</Text>
            <Text style={styles.safetyTimerLabel}>MINUTES TO SAFETY</Text>
          </View>
          
          <Text style={styles.safetyInstructions}>
            Tap the button below when you've reached your destination safely
          </Text>
          
          <TouchableOpacity 
            style={styles.safeButton}
            onPress={handleSafeConfirmation}
          >
            <View style={styles.safeButtonCircle}>
              <Text style={styles.safeButtonText}>SAFE</Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.emergencyText}>
            In case of emergency, shake your phone or press the power button 5 times
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="alert-circle" size={32} color="#FF4C4C" />
            </View>
            <Text style={styles.title}>Red Zone Setup</Text>
          </View>
          <Text style={styles.subtitle}>
            Set up your safe route and timer for high-risk areas
          </Text>
        </View>

        {/* Location Picker Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color="#1B98F5" />
            <Text style={styles.sectionTitle}>1. Select Red Zone Location</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Choose the area you'll be traveling through
          </Text>
          
          <TouchableOpacity 
            style={styles.pickerTrigger}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={[styles.pickerPlaceholder, redZoneLocation && styles.selectedText]}>
              {redZoneLocation || "Select a location..."}
            </Text>
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#a0aec0" 
            />
          </TouchableOpacity>
          
          {isExpanded && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={redZoneLocation}
                onValueChange={(itemValue) => {
                  setRedZoneLocation(itemValue);
                  setIsExpanded(false);
                }}
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                <Picker.Item label="Select location..." value={null} enabled={false} />
                {hardcodedLocations.map((loc) => (
                  <Picker.Item key={loc} label={loc} value={loc} />
                ))}
              </Picker>
            </View>
          )}
        </View>

        {/* Destination Input Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="navigate-outline" size={20} color="#1B98F5" />
            <Text style={styles.sectionTitle}>2. Enter Final Destination</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Where you'll be safe after passing through the red zone
          </Text>
          
          <View style={styles.inputContainer}>
            <Ionicons
              name="location-sharp"
              size={20}
              color="#1B98F5"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your safe destination"
              placeholderTextColor="#a0aec0"
              value={finalDestination || ""}
              onChangeText={setFinalDestination}
            />
          </View>
        </View>

        {/* Timer Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={20} color="#1B98F5" />
            <Text style={styles.sectionTitle}>3. Set Safety Timer</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Estimated time to reach safety (in minutes)
          </Text>
          
          <View style={styles.timerInputContainer}>
            <Ionicons
              name="timer-outline"
              size={20}
              color="#1B98F5"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter minutes"
              placeholderTextColor="#a0aec0"
              keyboardType="numeric"
              value={minutesToSafety}
              onChangeText={setMinutesToSafety}
            />
            <View style={styles.minutesBadge}>
              <Text style={styles.minutesText}>MINUTES</Text>
            </View>
          </View>
        </View>

        {/* Enable Button */}
        <TouchableOpacity
          style={[styles.enableButton, 
            (!redZoneLocation || !finalDestination || !minutesToSafety) && styles.disabledButton
          ]}
          onPress={handleEnableRedZone}
          disabled={!redZoneLocation || !finalDestination || !minutesToSafety}
        >
          <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
          <Text style={styles.enableButtonText}>Enable Red Zone Protection</Text>
        </TouchableOpacity>

        {/* Info Footer */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={18} color="#a0aec0" />
          <Text style={styles.infoText}>
            Once enabled, we'll monitor your journey and alert contacts if you don't reach safety in time.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  container: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconCircle: {
    backgroundColor: "rgba(255, 76, 76, 0.2)",
    padding: 10,
    borderRadius: 50,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#a0aec0",
    textAlign: "center",
    marginHorizontal: 20,
  },
  section: {
    backgroundColor: "#1B263B",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#a0aec0",
    marginBottom: 16,
  },
  pickerTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(27, 152, 245, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1B98F5",
  },
  pickerPlaceholder: {
    color: "#a0aec0",
    fontSize: 16,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "500",
  },
  pickerContainer: {
    marginTop: 10,
    backgroundColor: "#23334d",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(27, 152, 245, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#1B98F5",
  },
  timerInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(27, 152, 245, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#1B98F5",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 16,
    fontSize: 16,
  },
  minutesBadge: {
    backgroundColor: "rgba(27, 152, 245, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  minutesText: {
    color: "#1B98F5",
    fontSize: 12,
    fontWeight: "bold",
  },
  enableButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#1B98F5",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#1B98F5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: "#4a5568",
    shadowColor: "transparent",
  },
  enableButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(160, 174, 192, 0.1)",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  infoText: {
    color: "#a0aec0",
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  // Safety confirmation screen styles
  safetyContainer: {
    flex: 1,
    backgroundColor: "#0D1B2A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  safetyContent: {
    alignItems: "center",
    width: "100%",
  },
  safetyTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF4C4C",
    marginBottom: 10,
    textAlign: "center",
  },
  safetySubtitle: {
    fontSize: 18,
    color: "#a0aec0",
    marginBottom: 40,
    textAlign: "center",
  },
  safetyTimerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  safetyTimerText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#1B98F5",
  },
  safetyTimerLabel: {
    fontSize: 16,
    color: "#a0aec0",
    marginTop: -10,
  },
  safetyInstructions: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  safeButton: {
    marginBottom: 30,
  },
  safeButtonCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 16,
  },
  safeButtonText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  emergencyText: {
    fontSize: 14,
    color: "#a0aec0",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
  },
});

export default RedZoneSetupScreen;