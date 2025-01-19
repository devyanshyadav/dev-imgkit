import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { toast } from "sonner";
import { useStore } from "./zustsore";

export interface S3File {
  key: string;
  url: string;
  lastModified: Date;
  size: number;
}

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY || "",
  },
});

export const uploadFilesToS3 = async (files: File[]) => {
  const uploadSingleFile = async (file: File) => {
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop();
    const baseName = fileName.substring(0, fileName.lastIndexOf("."));

    try {
      const fileBuffer = await file.arrayBuffer();
      const key = `${
        useStore.getState().userDetails.bucketId
      }/${baseName}-${Date.now()}.${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: file.type,
      });

      await s3Client.send(command);

      return {
        url: `https://${
          import.meta.env.VITE_CLOUDFRONT_DOMAIN
        }.cloudfront.net/${key}`,
        key,
        size: file.size,
      };
    } catch (error) {
      console.error(`Error uploading file ${fileName} to S3:`, error);
      throw error;
    }
  };

  try {
    // Upload all files concurrently using Promise.all
    const results = await Promise.all(
      files.map((file) => uploadSingleFile(file))
    );

    return results;
  } catch (error) {
    console.error("Error during batch upload:", error);
    throw error;
  }
};

export const getFilesFromS3 = async (
  setS3Files: (files: S3File[]) => void,
  setIsLoading: (loading: boolean) => void
) => {
  try {
    setIsLoading(true);
    const command = new ListObjectsV2Command({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Prefix: `${useStore.getState().userDetails.bucketId}/`,
    });

    const { Contents = [] } = await s3Client.send(command);
    const signedUrls = await Promise.all(
      Contents.map(async (item) => {
        if (!item.Key) return undefined;
        // Construct base URL
        const baseUrl = `https://${
          import.meta.env.VITE_CLOUDFRONT_DOMAIN
        }.cloudfront.net/${item.Key}`;

        return {
          key: item.Key,
          url: baseUrl, // This will be the clean URL without parameters
          lastModified: item.LastModified || new Date(),
          size: item.Size || 0,
        };
      })
    );

    setS3Files(signedUrls.filter((file) => file !== undefined) as S3File[]);
  } catch (error) {
    console.error("Error fetching files from S3:", error);
    toast.error("Failed to load existing files");
  } finally {
    setIsLoading(false);
  }
};

export const deleteFileFromS3 = async (keys: string[]) => {
  try {
    const command = new DeleteObjectsCommand({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Delete: {
        Objects: keys.map((key) => ({
          Key: `${
            key.includes(useStore.getState().userDetails.bucketId)
              ? key
              : `${useStore.getState().userDetails.bucketId}/${key}`
          }`,
        })),
      },
    });
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    toast.error("Failed to delete file");
  }
};
