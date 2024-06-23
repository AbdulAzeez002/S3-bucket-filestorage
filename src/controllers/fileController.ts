import { Request, Response } from "express";
import PDF from "../models/fileModal";
import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import s3 from "../config/aws";

//@description: Add file
// @route : POST /api/file
// @access : private
export const addFile = async (req: Request, res: Response) => {
  try {
    const category = req.body.category;
    const location = req.body.location;
    const fileName = req.body.fileName;

    // Find the document by filename
    let pdfDocument = await PDF.findOne({ fileName });

    if (pdfDocument) {
      // return res.status(400).json({ error: "File name already exists" });
      return res.status(500).json({ error: "File name already exists" });
    }

    // If no document exists, create a new one
    pdfDocument = new PDF({
      fileName,
      fileCategory: category,
      fileLocation: location,
      versions: [],
    });

    // Determine the new version number

    if (!req.file) {
      return res.status(500).json({ error: "something went wrong" });
    }

    const data = await uploadToS3(req);

    // Create the new version
    const newVersion = {
      version: 0,
      data: data,
      createdAt: new Date(),
    };

    // Add the new version to the versions array
    pdfDocument.versions.push(newVersion);

    // Save the document
    await pdfDocument.save();

    res.status(201).json({ status: "File uploaded and stored in database." });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

export const getAllFiles = async (req: Request, res: Response) => {
  try {
    const files = await PDF.find({});
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "something went wrong" });
  }
};

export const getSingleFile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const file = await PDF.findById(id);
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: "something went wrong" });
  }
};

export const addVersion = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const file = await PDF.findById(id);

    if (!file) {
      return res.status(400).json({ error: "something went wrong" });
    }

    const newVersionNumber =
      file.versions.length > 0
        ? file.versions[file.versions.length - 1].version + 1
        : 1;

    const data = await uploadToS3(req);

    // Create the new version
    const newVersion = {
      version: newVersionNumber,
      data: data,
      createdAt: new Date(),
    };

    // Add the new version to the versions array
    file.versions.push(newVersion);

    // Save the document
    await file.save();

    res.status(200).json("new version added");
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

// export const uploadFile = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Function to handle the upload stream
//     const uploadStream = (buffer: Buffer): Promise<UploadApiResponse> => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { resource_type: "auto" },
//           (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result as UploadApiResponse);
//             }
//           }
//         );
//         streamifier.createReadStream(buffer).pipe(stream);
//       });
//     };

//     const result = await uploadStream(req.file.buffer);
//     res.status(200).json({ message: "File uploaded successfully", result });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

const uploadToS3 = async (req: Request) => {
  try {
    const fileContent = req.file?.buffer;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME ?? "",
      Key: req.file?.originalname ?? "newfile", // File name you want to save as in S3
      Body: fileContent,
    };

    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    throw new Error("some thing went wrong during s3 uploa");
  }
};
