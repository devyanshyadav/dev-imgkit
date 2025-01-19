import React, { useState, useEffect } from "react";
import {
  FileText,
  File as FileIcon,
  Play,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { getFileType } from "./file-type";

type FilePreviewProps = {
  url: string;
  filename?: string;
  className?: string;
};

type FileState = {
  status: "loading" | "loaded" | "error";
  type: string | null;
  error: string | null;
  mimeType: string | null;
};

const FilePreview: React.FC<FilePreviewProps> = ({
  url,
  filename = "",
}) => {
  const [state, setState] = useState<FileState>({
    status: "loading",
    mimeType: null,
    type: null,
    error: null,
  });


  useEffect(() => {
    const loadFile = async () => {
      try {
        setState({ status: "loading", type: null, error: null, mimeType: null });

        // Get file type from URL
        const fileType = getFileType({url});

        if (fileType.category === "image") {
          // Verify image can be loaded
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = url;
          });
        }

        setState({ status: "loaded", type: fileType.category, error: null, mimeType: fileType.mimeType });
      } catch (error: any) {
        console.error("Error loading file:", error);
        setState({
          status: "error",
          type: "unknown",
          error: error.message || "Unknown error",
          mimeType: null,
        });
      }
    };

    loadFile();
  }, [url]);

  const renderContent = () => {
    if (state.status === "loading") {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          <span className="mt-2 text-sm text-gray-500">Loading...</span>
        </div>
      );
    }

    if (state.status === "error") {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <FileIcon className="w-8 h-8 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">Error loading file</span>
        </div>
      );
    }

    switch (state.type) {
      case "image":
        return (
          <img
            src={url}
            alt={filename}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        );

      case "video":
        return (
            <video
              src={url}
              controls
              className="w-full h-full object-contain"
              preload="metadata"
            />
        );

      case "document":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <FileText className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500 flex items-center gap-1"><p className="uppercase">{state.mimeType}</p> Document</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              View <span className="uppercase">{state.mimeType}</span>
            </a>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <FileIcon className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">{filename}</span>
          </div>
        );
    }
  };

  return renderContent();
};

export default FilePreview;
