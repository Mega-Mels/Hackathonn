// src/services/api.ts
import axios from "axios";

export const API_URL = "mongodb+srv://luhlelomels:<db_password>@hackathon.zzoqu6d.mongodb.net/?retryWrites=true&w=majority&appName=Hackathon"; // or your cloud URL

export const submitReport = async (reportData: any) => {
  const response = await axios.post(`${API_URL}/api/reports`, reportData);
  return response.data;
};
