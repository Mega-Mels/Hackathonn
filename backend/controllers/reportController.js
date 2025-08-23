import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  try {
    const { reporterName, incidentDate, location, description } = req.body;
    const image = req.file ? req.file.filename : null; // get uploaded image filename

    const report = await Report.create({
      reporterName,
      incidentDate,
      location,
      description,
      image,
    });

    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create report" });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};
