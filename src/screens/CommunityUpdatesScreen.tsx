import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

const CommunityUpdatesScreen = ({ navigation }: { navigation: any }) => {
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      type: "Theft",
      location: "Main Street & 5th Ave",
      time: "2 hours ago",
      severity: "Medium",
      description: "Reported bag snatching incident",
    },
    {
      id: 2,
      type: "Harassment",
      location: "Central Park area",
      time: "5 hours ago",
      severity: "Low",
      description: "Verbal harassment reported by multiple women",
    },
    {
      id: 3,
      type: "Suspicious Activity",
      location: "Market District",
      time: "Yesterday",
      severity: "High",
      description: "Group following women near shopping area",
    },
  ]);

  const [safeRoutes, setSafeRoutes] = useState([
    {
      id: 1,
      name: "Downtown Safe Path",
      description: "Well-lit route with security cameras",
      length: "1.2 miles",
      time: "25 min walk",
    },
    {
      id: 2,
      name: "University Corridor",
      description: "Campus security patrols frequently",
      length: "0.8 miles",
      time: "15 min walk",
    },
  ]);

  const [areasToAvoid, setAreasToAvoid] = useState([
    {
      id: 1,
      name: "Industrial Zone after dark",
      reason: "Poor lighting and low patrol frequency",
    },
    {
      id: 2,
      name: "Alley behind Main Street shops",
      reason: "Multiple reports of harassment",
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Updates</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Recent Incidents Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Safety Incidents</Text>
          {incidents.map((incident) => (
            <View key={incident.id} style={styles.incidentCard}>
              <View style={styles.incidentHeader}>
                <View style={[
                  styles.severityIndicator, 
                  { backgroundColor: incident.severity === "High" ? "#FF4C4C" : incident.severity === "Medium" ? "#FFA500" : "#4CAF50" }
                ]} />
                <Text style={styles.incidentType}>{incident.type}</Text>
                <Text style={styles.incidentTime}>{incident.time}</Text>
              </View>
              <Text style={styles.incidentLocation}>{incident.location}</Text>
              <Text style={styles.incidentDescription}>{incident.description}</Text>
            </View>
          ))}
        </View>

        {/* Safe Routes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Safe Routes</Text>
          {safeRoutes.map((route) => (
            <TouchableOpacity key={route.id} style={styles.routeCard}>
              <Ionicons name="walk" size={24} color="#1B98F5" />
              <View style={styles.routeInfo}>
                <Text style={styles.routeName}>{route.name}</Text>
                <Text style={styles.routeDescription}>{route.description}</Text>
                <View style={styles.routeDetails}>
                  <Text style={styles.routeDetail}>{route.length}</Text>
                  <Text style={styles.routeDetail}>{route.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Areas to Avoid Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Areas to Avoid</Text>
          {areasToAvoid.map((area) => (
            <View key={area.id} style={styles.areaCard}>
              <Ionicons name="warning" size={24} color="#FF4C4C" />
              <View style={styles.areaInfo}>
                <Text style={styles.areaName}>{area.name}</Text>
                <Text style={styles.areaReason}>{area.reason}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Safety Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>• Stay in well-lit areas after dark</Text>
            <Text style={styles.tipText}>• Keep your phone charged and accessible</Text>
            <Text style={styles.tipText}>• Share your location with trusted contacts</Text>
            <Text style={styles.tipText}>• Trust your instincts - if something feels wrong, leave</Text>
          </View>
        </View>
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
    marginBottom: 12,
  },
  incidentCard: {
    backgroundColor: "#1B263B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  incidentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  incidentType: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 8,
  },
  incidentTime: {
    color: "#a0aec0",
    fontSize: 12,
  },
  incidentLocation: {
    color: "#1B98F5",
    fontWeight: "500",
    marginBottom: 4,
  },
  incidentDescription: {
    color: "#a0aec0",
  },
  routeCard: {
    backgroundColor: "#1B263B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  routeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  routeName: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 4,
  },
  routeDescription: {
    color: "#a0aec0",
    marginBottom: 8,
  },
  routeDetails: {
    flexDirection: "row",
  },
  routeDetail: {
    color: "#1B98F5",
    fontSize: 12,
    marginRight: 16,
  },
  areaCard: {
    backgroundColor: "#1B263B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  areaInfo: {
    marginLeft: 12,
    flex: 1,
  },
  areaName: {
    color: "#FF4C4C",
    fontWeight: "bold",
    marginBottom: 4,
  },
  areaReason: {
    color: "#a0aec0",
  },
  tipCard: {
    backgroundColor: "#1B263B",
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    color: "#fff",
    marginBottom: 8,
  },
});

export default CommunityUpdatesScreen;