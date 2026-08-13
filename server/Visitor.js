import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true, unique: true, index: true },
    sessionId: { type: String, default: "" },
    firstSeen: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now },
    visitCount: { type: Number, default: 0 },
    totalDurationMs: { type: Number, default: 0 },
    lastSessionDurationMs: { type: Number, default: 0 },
    lastPath: { type: String, default: "/" },
    userAgent: { type: String, default: "" },
    browser: { type: String, default: "" },
    os: { type: String, default: "" },
    deviceType: { type: String, default: "" },
    platform: { type: String, default: "" },
    language: { type: String, default: "" },
    screen: { type: String, default: "" },
    timezone: { type: String, default: "" },
    country: { type: String, default: "" },
    region: { type: String, default: "" },
    city: { type: String, default: "" },
  },
  { versionKey: false }
);

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;
