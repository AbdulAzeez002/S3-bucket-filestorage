

import mongoose, { Document, Schema } from "mongoose";

// Interface for a single version of the PDF
interface IPDFVersion {
  version: number;
  data: string;
  createdAt: Date;
}

// Interface for the PDF Document
export interface IPDF extends Document {
  fileName: string;
  fileCategory: string;
  fileLocation: string;
  versions: IPDFVersion[];
}

// Create a schema for storing PDF versions
const pdfVersionSchema = new Schema<IPDFVersion>({
  version: { type: Number, required: true },
  data: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a schema for storing PDF files with versioning
const pdfSchema = new Schema<IPDF>(
  {
    fileName: { type: String, required: true },
    fileCategory: { type: String, required: true },
    fileLocation: { type: String, required: true },
    versions: { type: [pdfVersionSchema], required: true },
  },
  {
    timestamps: true, // Add timestamps for createdAt and updatedAt
  }
);

// Create a unique index on filename
pdfSchema.index({ filename: 1 }, { unique: true });

export default mongoose.model<IPDF>("PDF", pdfSchema);
