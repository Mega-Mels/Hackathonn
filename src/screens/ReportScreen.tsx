import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TextInput,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Animated,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";
import { rnWalletService as walletService } from "../services/rnWalletService";
import { submitToBlockDAG, getBalance, BLOCKDAG_CONFIG } from "../services/rnBlockDAGService";

const { width } = Dimensions.get("window");

const ReportScreen = ({ onClose }: { onClose: () => void }) => {
  const [reporterName, setReporterName] = useState("");
  const [incidentDate, setIncidentDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width));
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [bdagBalance, setBdagBalance] = useState<string>("0");

  const navigation = useNavigation();

  // Check if wallet is already connected
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
  if (walletService.isConnected()) {
    setIsWalletConnected(true);
    try {
      const address = walletService.getAddress(); // Remove await since it's not async anymore
      setWalletAddress(address);
      // Check balance when wallet is connected
      const balance = await getBalance(address);
      setBdagBalance(balance);
    } catch (error) {
      console.error("Error getting wallet info:", error);
    }
  }
};
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const address = await walletService.connect();
      setIsWalletConnected(true);
      setWalletAddress(address);
      
      // Get balance after connecting
      const balance = await getBalance(address);
      setBdagBalance(balance);
      
      Alert.alert("Wallet Connected", `Connected to: ${address.substring(0, 8)}...\nBalance: ${balance} BDAG`);
    } catch (error) {
      Alert.alert("Connection Failed", "Could not connect to wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    await walletService.disconnect();
    setIsWalletConnected(false);
    setWalletAddress("");
    setBdagBalance("0");
    Alert.alert("Wallet Disconnected", "You have been disconnected");
  };

  const checkBalance = async () => {
    if (!isWalletConnected) {
      Alert.alert("Wallet Not Connected", "Please connect your wallet first");
      return;
    }

    try {
      const balance = await getBalance(walletAddress);
      setBdagBalance(balance);
      Alert.alert("Balance", `Your BDAG Balance: ${balance} BDAG`);
    } catch (error) {
      Alert.alert("Error", "Failed to check balance");
    }
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsMenuOpen(false);
  };

  const navigateTo = (screen: string) => {
    closeMenu();
    navigation.navigate(screen as never);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access photos is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Camera permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setIncidentDate(selectedDate);
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const handleSubmit = async () => {
    if (!reporterName || !location || !description) {
      Alert.alert("Missing Information", "Please fill all required fields!");
      return;
    }

    if (!isWalletConnected) {
      Alert.alert(
        "Wallet Not Connected", 
        "Please connect your MetaMask wallet first to submit reports to BlockDAG",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Connect Wallet", onPress: connectWallet }
        ]
      );
      return;
    }

    // Check if user has sufficient balance
    if (parseFloat(bdagBalance) < 0.001) {
      Alert.alert(
        "Low Balance", 
        `Your BDAG balance is low (${bdagBalance} BDAG). You might not have enough for gas fees.`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Get BDAG", 
            onPress: () => Linking.openURL(BLOCKDAG_CONFIG.network.faucet) 
          },
          { 
            text: "Submit Anyway", 
            onPress: () => submitReportToBlockDAG() 
          }
        ]
      );
      return;
    }

    submitReportToBlockDAG();
  };

  const submitReportToBlockDAG = async () => {
    setIsSubmitting(true);
    
    try {
      const reportData = {
        reporterName,
        incidentDate: incidentDate.toISOString(),
        location,
        description,
        image: imageUri || null,
      };

      const txHash = await submitToBlockDAG(reportData);
      setTransactionHash(txHash);
      
      Alert.alert(
        "Success!", 
        `Your report has been submitted to BlockDAG!\n\nTransaction Hash: ${txHash}\n\nView on explorer:`,
        [
          { 
            text: "View on Explorer", 
            onPress: () => Linking.openURL(`${BLOCKDAG_CONFIG.network.explorerUrl}tx/${txHash}`) 
          },
          { text: "OK", onPress: onClose }
        ]
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to submit report to BlockDAG. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Menu items data
  const menuItems = [
    { id: 1, title: "Community Updates", icon: "megaphone", screen: "CommunityUpdates" },
    { id: 2, title: "Travel Buddies", icon: "people", screen: "TravelBuddies" },
    { id: 3, title: "Past Reports", icon: "document-text", screen: "PastReports" },
    { id: 4, title: "Profile Management", icon: "person", screen: "ProfileManagement" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Hamburger Menu Button */}
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Entypo name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Side Menu */}
        <Animated.View 
          style={[
            styles.menuContainer,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity onPress={closeMenu}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.menuItems}>
            {menuItems.map(item => (
              <TouchableOpacity 
                key={item.id}
                style={styles.menuItem}
                onPress={() => navigateTo(item.screen)}
              >
                <Ionicons name={item.icon as any} size={22} color="#1B98F5" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.menuFooter}>
            <Text style={styles.menuFooterText}>SafeTravel App v1.0</Text>
            <Text style={styles.menuFooterText}>Powered by BlockDAG</Text>
          </View>
        </Animated.View>

        {/* Overlay when menu is open */}
        {isMenuOpen && (
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Submit Incident Report</Text>
              <Text style={styles.subtitle}>Secured by BlockDAG Testnet</Text>
            </View>

            {/* Wallet Connection Section */}
            <View style={styles.walletSection}>
              {isWalletConnected ? (
                <View style={styles.connectedWallet}>
                  <Ionicons name="wallet" size={20} color="#4CAF50" />
                  <View style={styles.walletInfo}>
                    <Text style={styles.walletAddress}>
                      {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}
                    </Text>
                    <Text style={styles.walletBalance}>{bdagBalance} BDAG</Text>
                  </View>
                  <TouchableOpacity onPress={checkBalance} style={styles.balanceButton}>
                    <Ionicons name="refresh" size={16} color="#1B98F5" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={disconnectWallet} style={styles.disconnectButton}>
                    <Text style={styles.disconnectText}>Disconnect</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.connectButton}
                  onPress={connectWallet}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="wallet" size={20} color="#fff" />
                      <Text style={styles.connectButtonText}>Connect MetaMask</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Red Zone Button */}
            <TouchableOpacity
              style={styles.redZoneTile}
              onPress={() => navigation.navigate("RedZoneSetup" as never)}
            >
              <View style={styles.redZoneContent}>
                <MaterialIcons name="warning" size={24} color="#fff" />
                <Text style={styles.redZoneText}>Setup Red Zone Alert</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>

            {/* Form Section */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Report Details</Text>
              
              {/* Reporter Name */}
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#1B98F5" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your Name"
                  placeholderTextColor="#a0aec0"
                  value={reporterName}
                  onChangeText={setReporterName}
                />
              </View>

              {/* Date Picker */}
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                <Ionicons name="calendar-outline" size={20} color="#1B98F5" style={styles.inputIcon} />
                <Text style={styles.dateText}>
                  {incidentDate.toDateString()}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#a0aec0" />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={incidentDate}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                  maximumDate={new Date()}
                />
              )}

              {/* Location */}
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#1B98F5" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Incident Location"
                  placeholderTextColor="#a0aec0"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              {/* Description */}
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Ionicons name="document-text-outline" size={20} color="#1B98F5" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe what happened..."
                  placeholderTextColor="#a0aec0"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Image Section */}
              <View style={styles.imageSection}>
                <Text style={styles.imageSectionTitle}>Add Photo Evidence (Optional)</Text>
                
                {imageUri ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                      <Ionicons name="close-circle" size={24} color="#FF4C4C" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.imageButtonsContainer}>
                    <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                      <Ionicons name="image-outline" size={20} color="#1B98F5" />
                      <Text style={styles.imageButtonText}>Choose from Library</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                      <Ionicons name="camera-outline" size={20} color="#1B98F5" />
                      <Text style={styles.imageButtonText}>Take Photo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting || !isWalletConnected}
              >
                {isSubmitting ? (
                  <>
                    <ActivityIndicator color="#fff" />
                    <Text style={styles.submitButtonText}>Submitting to BlockDAG...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>
                      {isWalletConnected ? "Submit to BlockDAG" : "Connect Wallet to Submit"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* BlockDAG Info Footer */}
            <View style={styles.blockdagInfo}>
              <Ionicons name="lock-closed" size={16} color="#1B98F5" />
              <Text style={styles.blockdagInfoText}>
                Reports are secured on the BlockDAG testnet
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 60,
  },
  // Menu styles
  menuButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 10,
    backgroundColor: "rgba(27, 152, 245, 0.2)",
    padding: 10,
    borderRadius: 20,
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.75,
    height: "100%",
    backgroundColor: "#1B263B",
    zIndex: 20,
    padding: 20,
    paddingTop: 60,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#415A77",
    paddingBottom: 15,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(65, 90, 119, 0.3)",
  },
  menuItemText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 15,
  },
  menuFooter: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#415A77",
  },
  menuFooterText: {
    color: "#a0aec0",
    textAlign: "center",
    fontSize: 12,
    marginBottom: 4,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 15,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#1B98F5",
    textAlign: "center",
  },
  walletSection: {
    marginBottom: 20,
  },
  connectButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#F6851B", // MetaMask orange
    marginBottom: 15,
  },
  connectButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  connectedWallet: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginBottom: 15,
  },
  walletInfo: {
    flex: 1,
    marginLeft: 8,
  },
  walletAddress: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
  },
  walletBalance: {
    color: "#1B98F5",
    fontSize: 12,
  },
  balanceButton: {
    padding: 6,
    marginRight: 8,
  },
  disconnectButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255, 76, 76, 0.1)",
  },
  disconnectText: {
    color: "#FF4C4C",
    fontSize: 12,
  },
  redZoneTile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 76, 76, 0.2)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 76, 76, 0.5)",
  },
  redZoneContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  redZoneText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 10,
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
    paddingLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(27, 152, 245, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
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
  textAreaContainer: {
    alignItems: "flex-start",
    paddingTop: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(27, 152, 245, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1B98F5",
  },
  dateText: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  imageSection: {
    marginTop: 10,
  },
  imageSectionTitle: {
    fontSize: 16,
    color: "#a0aec0",
    marginBottom: 15,
    paddingLeft: 8,
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(27, 152, 245, 0.1)",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1B98F5",
    width: "48%",
  },
  imageButtonText: {
    color: "#1B98F5",
    marginLeft: 8,
    fontSize: 14,
  },
  imagePreviewContainer: {
    position: "relative",
    alignSelf: "center",
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#1B98F5",
  },
  removeImageButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  actionButtons: {
    marginTop: 10,
  },
  submitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#1B98F5",
    marginBottom: 15,
    shadowColor: "#1B98F5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#4a5568",
    shadowColor: "transparent",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "rgba(108, 117, 125, 0.3)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6C757D",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  blockdagInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 12,
    backgroundColor: "rgba(27, 152, 245, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1B98F5",
  },
  blockdagInfoText: {
    color: "#1B98F5",
    fontSize: 12,
    marginLeft: 8,
  },
});

export default ReportScreen;