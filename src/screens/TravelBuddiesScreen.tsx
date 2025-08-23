import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TravelBuddiesScreen = ({ navigation }: { navigation: any }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("All Areas");

  const areas = ["Downtown", "University", "Financial District", "Residential", "All Areas"];

  const travelBuddies = [
    {
      id: 1,
      name: "Sarah Johnson",
      area: "Downtown",
      work: "Marketing Manager",
      rating: 4.8,
      matches: 12,
      verified: true,
    },
    {
      id: 2,
      name: "Michelle Chen",
      area: "University",
      work: "Research Scientist",
      rating: 4.9,
      matches: 8,
      verified: true,
    },
    {
      id: 3,
      name: "Priya Sharma",
      area: "Financial District",
      work: "Financial Analyst",
      rating: 4.7,
      matches: 15,
      verified: true,
    },
    {
      id: 4,
      name: "Emily Williams",
      area: "Residential",
      work: "Teacher",
      rating: 4.6,
      matches: 6,
      verified: false,
    },
  ];

  const filteredBuddies = travelBuddies.filter(
    (buddy) =>
      (selectedArea === "All Areas" || buddy.area === selectedArea) &&
      (buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       buddy.work.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const requestBuddy = (buddyId: number) => {
    Alert.alert("Request Sent", "Your travel buddy request has been sent successfully!");
  };

  // Function to get background color based on name
  const getBackgroundColor = (name: string) => {
    const colors = ["#415A77", "#1B3A4B", "#3D5A80", "#2E4E6B", "#1B263B"];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Travel Buddies</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#a0aec0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or profession..."
          placeholderTextColor="#a0aec0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        horizontal 
        style={styles.areasScroll}
        showsHorizontalScrollIndicator={false}
      >
        {areas.map((area) => (
          <TouchableOpacity
            key={area}
            style={[
              styles.areaChip,
              selectedArea === area && styles.areaChipSelected,
            ]}
            onPress={() => setSelectedArea(area)}
          >
            <Text
              style={[
                styles.areaChipText,
                selectedArea === area && styles.areaChipTextSelected,
              ]}
            >
              {area}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>
          Available Travel Buddies ({filteredBuddies.length})
        </Text>

        {filteredBuddies.map((buddy) => (
          <View key={buddy.id} style={styles.buddyCard}>
            <View style={[styles.buddyPlaceholder, { backgroundColor: getBackgroundColor(buddy.name) }]}>
              <Text style={styles.buddyInitial}>
                {buddy.name.charAt(0)}
              </Text>
            </View>
            
            <View style={styles.buddyInfo}>
              <View style={styles.buddyHeader}>
                <Text style={styles.buddyName}>{buddy.name}</Text>
                {buddy.verified && (
                  <Ionicons name="checkmark-circle" size={16} color="#1B98F5" />
                )}
              </View>
              
              <Text style={styles.buddyWork}>{buddy.work}</Text>
              <Text style={styles.buddyArea}>{buddy.area} Area</Text>
              
              <View style={styles.buddyStats}>
                <View style={styles.stat}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.statText}>{buddy.rating}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="people" size={14} color="#1B98F5" />
                  <Text style={styles.statText}>{buddy.matches} matches</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.requestButton}
              onPress={() => requestBuddy(buddy.id)}
            >
              <Text style={styles.requestButtonText}>Request</Text>
            </TouchableOpacity>
          </View>
        ))}

        {filteredBuddies.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people" size={48} color="#a0aec0" />
            <Text style={styles.emptyStateText}>
              No travel buddies found for your criteria
            </Text>
            <TouchableOpacity style={styles.refineSearchButton}>
              <Text style={styles.refineSearchButtonText}>Refine Your Search</Text>
            </TouchableOpacity>
          </View>
        )}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B263B",
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: 12,
  },
  areasScroll: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  areaChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1B263B",
    marginRight: 8,
  },
  areaChipSelected: {
    backgroundColor: "#1B98F5",
  },
  areaChipText: {
    color: "#a0aec0",
  },
  areaChipTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  buddyCard: {
    backgroundColor: "#1B263B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  buddyPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  buddyInitial: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  buddyInfo: {
    flex: 1,
  },
  buddyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  buddyName: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 6,
  },
  buddyWork: {
    color: "#1B98F5",
    marginBottom: 2,
  },
  buddyArea: {
    color: "#a0aec0",
    fontSize: 12,
    marginBottom: 8,
  },
  buddyStats: {
    flexDirection: "row",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    color: "#a0aec0",
    fontSize: 12,
    marginLeft: 4,
  },
  requestButton: {
    backgroundColor: "#1B98F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  requestButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    color: "#a0aec0",
    marginTop: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  refineSearchButton: {
    backgroundColor: "#1B98F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refineSearchButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default TravelBuddiesScreen;