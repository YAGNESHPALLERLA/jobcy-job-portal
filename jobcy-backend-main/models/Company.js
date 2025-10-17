const { Schema, model } = require('mongoose');
       
const CompanySchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    industry: { type: String },
    location: { type: String },
    website: { type: String },
    description: { type: String },
    size: { type: String, enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"] },
    logo: { type: String },
    status: { type: String, enum: ["Active", "Inactive", "Pending"], default: "Active" },
    registeredBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin who registered
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

module.exports = model('Company', CompanySchema);