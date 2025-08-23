import axios from "axios";

const API_URL = "http://196.24.128.165:5000/api/reports"; // Use your LAN IP if testing on a device

export const submitReport = async (reportData: any) => {
  try {
    const response = await axios.post(API_URL, reportData);
    return response.data;
  } catch (error) {
    console.error("Error submitting report:", error);
    throw error;
  }
};


export const fetchReports = async () => {
  try {
    const response = await axios.get("http://196.24.128.165:5000/api/reports");
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};
