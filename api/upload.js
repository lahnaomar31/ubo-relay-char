import { createWriteStream } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: "File upload failed." });
      }

      const file = files.file;
      const fileStream = fs.createReadStream(file.filepath);

      try {
        const blobResponse = await createWriteStream(`uploads/${file.originalFilename}`, {
          access: "public",
          data: fileStream,
        });
        res.status(200).json({ url: blobResponse.url });
      } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Error uploading file." });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
