const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    fileUrl: {
      type: String,
      required: true
    },

    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder'
    },

    summary: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
