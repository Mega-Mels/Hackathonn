import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Switch,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const ProfileManagementScreen = ({ navigation }: { navigation: any }) => {
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    emergencyContact: {
      name: "Sarah Wilson",
      phone: "+1 (555) 987-6543",
      relationship: "Sister",
    },
    workArea: "Downtown",
    notificationEnabled: true,
    locationSharingEnabled: true,
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

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
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
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
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const updateProfile = () => {
    Alert.alert("Success", "Your profile has been updated!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Management</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Photo</Text>
          <View style={styles.photoSection}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <Ionicons name="person" size={40} color="#a0aec0" />
              </View>
            )}
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                <Ionicons name="image" size={20} color="#1B98F5" />
                <Text style={styles.photoButtonText}>Choose Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                <Ionicons name="camera" size={20} color="#1B98F5" />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Work Area</Text>
            <TextInput
              style={styles.input}
              value={profile.workArea}
              onChangeText={(text) => setProfile({ ...profile, workArea: text })}
            />
          </View>
        </View>

        {/* Emergency Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Name</Text>
            <TextInput
              style={styles.input}
              value={profile.emergencyContact.name}
              onChangeText={(text) => setProfile({ 
                ...profile, 
                emergencyContact: { ...profile.emergencyContact, name: text } 
              })}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profile.emergencyContact.phone}
              onChangeText={(text) => setProfile({ 
                ...profile, 
                emergencyContact: { ...profile.emergencyContact, phone: text } 
              })}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Relationship</Text>
            <TextInput
              style={styles.input}
              value={profile.emergencyContact.relationship}
              onChangeText={(text) => setProfile({ 
                ...profile, 
                emergencyContact: { ...profile.emergencyContact, relationship: text } 
              })}
            />
          </View>
        </View>

        {/* Privacy Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Settings</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive safety alerts and updates
              </Text>
            </View>
            <Switch
              value={profile.notificationEnabled}
              onValueChange={(value) => setProfile({ ...profile, notificationEnabled: value })}
              trackColor={{ false: "#767577", true: "#1B98F5" }}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Location Sharing</Text>
              <Text style={styles.settingDescription}>
                Share your location with trusted contacts
              </Text>
            </View>
            <Switch
              value={profile.locationSharingEnabled}
              onValueChange={(value) => setProfile({ ...profile, locationSharingEnabled: value })}
              trackColor={{ false: "#767577", true: "#1B98F5" }}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>SafeTravel App v1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#1B263B",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  photoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profilePhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1B263B",
    justifyContent: "center",
    alignItems: "center",
  },
  photoButtons: {
    marginLeft: 16,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  photoButtonText: {
    color: "#1B98F5",
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#fff",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#1B263B",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    color: "#fff",
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    color: "#a0aec0",
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: "#1B98F5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  versionText: {
    color: "#a0aec0",
    textAlign: "center",
    fontSize: 12,
  },
});

export default ProfileManagementScreen;