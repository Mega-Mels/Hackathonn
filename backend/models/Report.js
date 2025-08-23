import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reporterName: { type: String, required: true },
  incidentDate: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // optional field to store uploaded image filename
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
