const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { uploadReport,getMyReports, getReportById, deleteReport, updateReport } = require("../controllers/reportcontroller");

console.log("protect:", protect);
console.log("upload:", upload);
console.log("uploadReport:", uploadReport);
console.log("getMyReports:", getMyReports);
console.log("getReportById:", getReportById);
console.log("deleteReport:", deleteReport);
console.log("updateReport:", updateReport);

router.get("/myreports", protect, getMyReports);
router.get("/:id", protect, getReportById);
router.delete("/:id", protect, deleteReport);
router.put("/:id", protect, updateReport);
router.post("/upload", protect, upload.single("report"), uploadReport);



module.exports = router;
