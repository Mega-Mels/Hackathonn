import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PastReportsScreen = ({ navigation }: { navigation: any }) => {
  const [reports, setReports] = useState([
    {
      id: 1,
      type: "Harassment",
      location: "Main Street",
      date: "2023-10-15",
      status: "Resolved",
      description: "Verbal harassment while walking home",
    },
    {
      id: 2,
      type: "Suspicious Activity",
      location: "Central Park",
      date: "2023-10-10",
      status: "Under Review",
      description: "Noticed someone following me for several blocks",
    },
    {
      id: 3,
      type: "Theft Attempt",
      location: "Market District",
      date: "2023-10-05",
      status: "Resolved",
      description: "Someone tried to snatch my phone",
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Resolved", "Under Review", "Harassment", "Theft"];

  const filteredReports = reports.filter(
    (report) =>
      selectedFilter === "All" ||
      report.status === selectedFilter ||
      report.type === selectedFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "#4CAF50";
      case "Under Review":
        return "#FFA500";
      default:
        return "#a0aec0";
    }
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case "Harassment":
        return "warning";
      case "Suspicious Activity":
        return "eye";
      case "Theft Attempt":
        return "bag-handle";
      default:
        return "document-text";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "Harassment":
        return "#FF4C4C";
      case "Suspicious Activity":
        return "#FFA500";
      case "Theft Attempt":
        return "#1B98F5";
      default:
        return "#a0aec0";
    }
  };

  const viewReportDetails = (reportId: number) => {
    Alert.alert("Report Details", `Viewing details for report #${reportId}`);
  };

  const shareReport = (reportId: number) => {
    Alert.alert("Share Report", `Sharing report #${reportId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Past Reports</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        horizontal 
        style={styles.filtersScroll}
        showsHorizontalScrollIndicator={false}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipSelected,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextSelected,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>
          Your Reports ({filteredReports.length})
        </Text>

        {filteredReports.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={styles.reportCard}
            onPress={() => viewReportDetails(report.id)}
          >
            <View style={styles.reportHeader}>
              <View style={styles.reportIconContainer}>
                <Ionicons 
                  name={getReportIcon(report.type) as any} 
                  size={24} 
                  color={getIconColor(report.type)} 
                />
              </View>
              
              <View style={styles.reportTypeContainer}>
                <Text style={styles.reportType}>{report.type}</Text>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: getStatusColor(report.status) }
                ]} />
              </View>
              
              <Text style={styles.reportDate}>{report.date}</Text>
            </View>

            <Text style={styles.reportLocation}>{report.location}</Text>
            <Text style={styles.reportDescription}>{report.description}</Text>

            <View style={styles.reportFooter}>
              <Text style={[styles.reportStatus, { color: getStatusColor(report.status) }]}>
                {report.status}
              </Text>
              <View style={styles.reportActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => viewReportDetails(report.id)}
                >
                  <Ionicons name="eye" size={16} color="#1B98F5" />
                  <Text style={styles.actionText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => shareReport(report.id)}
                >
                  <Ionicons name="share" size={16} color="#1B98F5" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredReports.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text" size={48} color="#a0aec0" />
            <Text style={styles.emptyStateText}>
              No reports found for this filter
            </Text>
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
  filtersScroll: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1B263B",
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: "#1B98F5",
  },
  filterChipText: {
    color: "#a0aec0",
  },
  filterChipTextSelected: {
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
  reportCard: {
    backgroundColor: "#1B263B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(27, 152, 245, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reportTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  reportType: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reportDate: {
    color: "#a0aec0",
    fontSize: 12,
  },
  reportLocation: {
    color: "#1B98F5",
    fontWeight: "500",
    marginBottom: 8,
  },
  reportDescription: {
    color: "#a0aec0",
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportStatus: {
    fontWeight: "500",
  },
  reportActions: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  actionText: {
    color: "#1B98F5",
    fontSize: 12,
    marginLeft: 4,
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
  },
});

export default PastReportsScreen;