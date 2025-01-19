import React, { useEffect, useState, useCallback, useRef } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

import { getFileType } from "../../utils/file-type";
import DevDropdown from "../../components/dev-components/dev-dropdown";
import DevInput from "../../components/dev-components/dev-input";
import { FiDownload, FiSearch } from "react-icons/fi";
import DevButton from "../../components/dev-components/dev-button";
import DevSelect from "../../components/dev-components/dev-select";
import { FaListUl } from "react-icons/fa";
import {
  getFilesFromS3,
  S3File,
  uploadFilesToS3,
} from "../../utils/s3-actions";
import FileUploadUi from "../../components/dashboard-cmp/file-upload-ui";
import { PiUploadBold, PiUploadDuotone } from "react-icons/pi";
import AssetCards, {
  normalizeFileSize,
} from "../../components/global-cmp/asset-cards";
import clsx from "clsx";
import { RiLoader2Line } from "react-icons/ri";
import { BsGridFill } from "react-icons/bs";
import SelectBar from "../../components/global-cmp/select-bar";
import { useStore } from "../../utils/zustsore";
import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [s3Files, setS3Files] = useState<S3File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedS3Files, setSelectedS3Files] = useState<S3File[]>([]);
  const [searchedFiles, setSearchedFiles] = useState<S3File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [assetTypes, setAssetTypes] = useState<string[]>([]);
  const { userDetails } = useStore();
  const navigate = useNavigate();
  const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB in bytes

  useEffect(() => {
    getFilesFromS3(setS3Files, setIsLoading);
  }, []);

  useEffect(() => {
    let uniqueAssetTypes: string[] = [];
    if (s3Files.length > 0) {
      uniqueAssetTypes = [
        "All",
        ...new Set(
          s3Files.map((file) => getFileType({ url: file.url }).mimeType ?? "")
        ),
      ];
      setAssetTypes(uniqueAssetTypes);
    }
  }, [s3Files]);

  const extractFilename = (url: string) => {
    try {
      const segments = url.split("/");
      return segments[segments.length - 1];
    } catch (error) {
      return null;
    }
  };

  const handleUploadFiles = async (acceptedFiles: File[]) => {
    try {
      const existingFilesSize = s3Files
        .map((f) => f.size)
        .reduce((a, b) => a + b, 0);
      const newFilesSize = acceptedFiles
        .map((f) => f.size)
        .reduce((a, b) => a + b, 0);
      const totalSize = existingFilesSize + newFilesSize;
      // Check if total size exceeds limit
      if (totalSize > MAX_SIZE_BYTES) {
        toast.info(
          `Total size (${normalizeFileSize(
            totalSize
          )}) exceeds the limit of 20MB`
        );
        return;
      }

      setIsUploading(true);
      toast.custom(
        () => (
          <div className="bg-white p-5 min-w-60 rounded-xl shadow-md border border-shade/50 flex items-center gap-2">
            <RiLoader2Line className="text-3xl animate-spin text-accent" />
            <p>
              Uploading {acceptedFiles.length}{" "}
              {acceptedFiles.length === 1 ? "File" : "Files"} to S3
            </p>
          </div>
        ),
        { id: "uploading", duration: Infinity }
      );

      const uploadResults = await uploadFilesToS3(acceptedFiles);

      const newFiles: S3File[] = uploadResults.map((result) => ({
        key: extractFilename(result.key) || result.key,
        url: result.url.replace(/%20/g, "%2520"),
        lastModified: new Date(),
        size: result.size,
      }));

      setS3Files((prevFiles) => [...newFiles, ...prevFiles]);

      toast.success(
        `Successfully uploaded ${acceptedFiles.length} ${
          acceptedFiles.length === 1 ? "file" : "files"
        }`
      );
    } catch (error) {
      // If multiple files fail, show error for each
      acceptedFiles.forEach((file) => {
        toast.error(`Failed to upload ${file.name}`);
      });
    } finally {
      setIsUploading(false);
      toast.dismiss("uploading");
    }
  };

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isUploading || !event.target.files?.length) return;

      const files = Array.from(event.target.files);
      await handleUploadFiles(files);

      // Reset the input value after processing
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [isUploading]
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSearch = (value: string) => {
    const filteredFiles = s3Files.filter((file) =>
      file.key.toLowerCase().includes(value.toLowerCase())
    );
    filteredFiles.length > 0 && setSearchedFiles(filteredFiles);
  };

  const selectAsset = (type: string) => {
    setSearchedFiles(s3Files.filter((f) => getFileType(f).mimeType === type));
  };

  useEffect(() => {
    setSearchedFiles([]);
  }, [s3Files]);

  const UploadBtn = ({ text }: { text: string }) => {
    return (
      <DevButton
        className="outlineShadow group"
        onClick={handleUploadClick}
        disabled={isUploading}
      >
        {!isUploading && (
          <PiUploadBold className="group-hover:animate-bounce " />
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        <span className="md:block hidden">
          {isUploading ? "Uploading..." : text}
        </span>
        {isUploading && <RiLoader2Line className="animate-spin text-lg" />}
      </DevButton>
    );
  };

  return (
    <>
      <header className="w-full px-2 space-y-2">
        <div className="flex items-center justify-between">
          <a href="/" className="flex gap-1 *:select-none items-center">
            <img
              src="/logo.png"
              alt="logo"
              className="aspect-square w-10 h-10"
            />
            <h2 className="font-semibold flex text-lg flex-col">
              DEV{" "}
              <span className="text-xs text-accent p-0.5 px-2 rounded-full bg-accent/20">
                IMG KIT
              </span>
            </h2>
          </a>
          <div className="flex items-center gap-2">
            {!isLoading && (
              <div className="bg-white border border-shade px-2 rounded-xl flex items-center gap-1">
                <img
                  className={clsx("w-10 select-none pointer-events-none")}
                  src="/db.png"
                  alt="db icon"
                />
                <h3>
                  {normalizeFileSize(
                    s3Files.map((f) => f.size).reduce((a, b) => a + b, 0)
                  )}
                  /{normalizeFileSize(MAX_SIZE_BYTES).replace(".00", "")}
                </h3>
              </div>
            )}
            <DevDropdown
              button={
                <DevButton
                  asIcon
                  rounded="full"
                  variant="flat"
                  className="!h-10 !w-10"
                  size="lg"
                >
                  <img src="/avatar.png" alt="avatar icon" />
                </DevButton>
              }
            >
              <div className="*:p-0.5 *:px-2 overflow-hidden">
                <p>👋{userDetails.email.split("@")[0]}</p>
                <p>Bucket ID: {userDetails.bucketId}</p>
                <hr className="!p-0" />
                <button
                  onClick={async () => {
                    await signOut();
                    navigate("/login");
                  }}
                  className="text-red-500 rounded-bl-md hover:bg-red-500/20 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </DevDropdown>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <DevInput
            placeholder="Search..."
            onChange={(e) => handleSearch(e.target.value)}
            icon={<FiSearch />}
          />

          <div className="flex items-center gap-3">
            <DevButton
              onClick={() => setView(view === "grid" ? "list" : "grid")}
              variant="flat"
              className="flex-shrink-0"
              disabled={s3Files.length === 0}
              asIcon
            >
              {view === "grid" ? <BsGridFill /> : <FaListUl />}
            </DevButton>
            <DevSelect
              options={assetTypes.map((type) => ({ value: type, label: type }))}
              onChange={(e) => selectAsset(e.target.value)}
              placeholder="Asset Type"
            />
            <UploadBtn text="Upload" />
          </div>
        </div>
      </header>

      <div className="flex-grow bg-white relative rounded-2xl p-2 border border-shade overflow-auto">
        <Dropzone noClick onDrop={handleUploadFiles}>
          {({ getRootProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={clsx(
                "h-full w-full rounded-xl  content-start grid gap-4 transition-colors",
                isDragActive && "border-accent/80  border-2 border-dashed",
                view === "grid" ? "grid-cols-2 md:grid-cols-5" : "grid-cols-1"
              )}
            >
              {isDragActive && (
                <div className="fileUploadUi backdrop-blur-sm border-4 border-dashed border-accent bg-accent/20 z-50 absolute inset-1 rounded-2xl grid place-items-center">
                  <FileUploadUi />
                </div>
              )}
              {!isLoading &&
                !searchedFiles.length &&
                !s3Files.length &&
                !isDragActive && (
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 text-center">
                    <img
                      className="h-56 select-none pointer-events-none"
                      src="/empty-folder.svg"
                    />
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold ">
                        No files found
                        <span className="text-accent font-semibold">!</span>
                      </h2>
                      <UploadBtn text="Upload Files" />
                    </div>
                  </div>
                )}
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="loadingFiles"></span>
                </div>
              ) : searchedFiles.length > 0 ? (
                <AssetCards
                  view={view}
                  files={searchedFiles}
                  setS3Files={setS3Files}
                  selectedS3Files={selectedS3Files}
                  setSelectedS3Files={setSelectedS3Files}
                />
              ) : (
                <AssetCards
                  view={view}
                  files={s3Files}
                  selectedS3Files={selectedS3Files}
                  setSelectedS3Files={setSelectedS3Files}
                  setS3Files={setS3Files}
                />
              )}
            </div>
          )}
        </Dropzone>
        <SelectBar
          selectedS3Files={selectedS3Files}
          setS3Files={setS3Files}
          setSelectedS3Files={setSelectedS3Files}
        />
      </div>
    </>
  );
};

export default Home;
