import {
  FileImage,
  FileText,
  FileCode,
  File,
  Database,
  Package,
  Image as ImageIcon,
  Video,
  Music,
  FileJson,
  FileSpreadsheet,
  FileArchive,
} from "lucide-react";

type FileTypeResult = {
  icon: React.ComponentType;
  url: string | null;
  objectUrl: string | null;
  mimeType: string;
  category: string;
};

interface ExtensionMap {
  [key: string]: { icon: React.ComponentType; category: string };
}

const EXTENSION_TYPE_MAP: ExtensionMap = {
  // Images
  png: { icon: ImageIcon, category: "image" },
  jpg: { icon: ImageIcon, category: "image" },
  jpeg: { icon: ImageIcon, category: "image" },
  gif: { icon: ImageIcon, category: "image" },
  bmp: { icon: ImageIcon, category: "image" },
  svg: { icon: ImageIcon, category: "image" },
  webp: { icon: ImageIcon, category: "image" },
  heic: { icon: ImageIcon, category: "image" },
  psd: { icon: FileImage, category: "image" },

  // Videos
  mp4: { icon: Video, category: "video" },
  avi: { icon: Video, category: "video" },
  mov: { icon: Video, category: "video" },
  webm: { icon: Video, category: "video" },

  // Audio
  mp3: { icon: Music, category: "audio" },
  wav: { icon: Music, category: "audio" },
  ogg: { icon: Music, category: "audio" },
  flac: { icon: Music, category: "audio" },

  // Documents
  pdf: { icon: FileText, category: "document" },
  txt: { icon: FileText, category: "document" },
  rtf: { icon: FileText, category: "document" },
  doc: { icon: FileText, category: "document" },
  docx: { icon: FileText, category: "document" },

  // Spreadsheets
  xls: { icon: FileSpreadsheet, category: "spreadsheet" },
  xlsx: { icon: FileSpreadsheet, category: "spreadsheet" },
  csv: { icon: FileSpreadsheet, category: "spreadsheet" },

  // Archives
  zip: { icon: FileArchive, category: "archive" },
  rar: { icon: FileArchive, category: "archive" },
  "7z": { icon: FileArchive, category: "archive" },
  tar: { icon: FileArchive, category: "archive" },
  gz: { icon: FileArchive, category: "archive" },

  // Code
  json: { icon: FileJson, category: "code" },
  js: { icon: FileCode, category: "code" },
  ts: { icon: FileCode, category: "code" },
  py: { icon: FileCode, category: "code" },
  java: { icon: FileCode, category: "code" },

  // Database
  sql: { icon: Database, category: "database" },
  db: { icon: Database, category: "database" },
  sqlite: { icon: Database, category: "database" },

  // Other
  exe: { icon: Package, category: "executable" },
  dmg: { icon: Package, category: "executable" },
  pkg: { icon: Package, category: "package" },
};

export const getFileType = ({ file, url }: { file?: File; url?: string }): FileTypeResult => {
  const mimeType =
    (url
      ? url.split('?')[0].split(".").pop()?.toLowerCase()
      : file?.type.split("/").pop()?.toLowerCase()) || "doc";
  const fileTypeInfo = EXTENSION_TYPE_MAP[mimeType] || {
    icon: File,
    category: "unknown",
  };
  let objectUrl = null;
  if (["image"].includes(fileTypeInfo.category) && !url && file) {
    objectUrl = URL.createObjectURL(file);
  }
  return {
    icon: fileTypeInfo.icon,
    mimeType,
    url: url || null,
    objectUrl,
    category: fileTypeInfo.category,
  };
};
