import React, { useState } from "react";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import DevCheckbox from "../dev-components/dev-checkbox";
import FilePreview from "../../utils/file-preview";
import { IoCopy, IoCopyOutline, IoTrashBinOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { S3File } from "../../utils/s3-actions";
import DevTable from "../dev-components/dev-table";
import DevClipboard from "../dev-components/dev-clipboard";
import useDownloader from "react-use-downloader";
import DeleteModal from "./delete-modal";
import DevModal from "../dev-components/dev-modal";
import TransformationModal from "./transformation-modal";
import { FileKey } from "lucide-react";
import { IoMdClose } from "react-icons/io";
import EditImgIcon from "../../utils/edit-img-icon";
import DevTooltip from "../dev-components/dev-tooltip";
import DevButton from "../dev-components/dev-button";
import { getFileType } from "../../utils/file-type";
import { toast } from "sonner";

export function normalizeFileSize(bytes: number) {
  const kb = bytes / 1024;

  if (kb < 500) {
    return `${kb.toFixed(2)} KB`;
  }

  const mb = kb / 1024;
  if (mb < 1000) {
    return `${mb.toFixed(2)} MB`;
  }

  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

type Props = {
  files: S3File[];
  selectedS3Files: S3File[];
  setSelectedS3Files: React.Dispatch<React.SetStateAction<S3File[]>>;
  setS3Files: React.Dispatch<React.SetStateAction<S3File[]>>;

  view: "grid" | "list";
};
const AssetCards = ({
  files,
  selectedS3Files,
  setSelectedS3Files,
  setS3Files,
  view,
}: Props) => {
  const [transformImgKey, setTransformImgKey] = useState<string | null>(null);
  const getFileName = (key: string) => {
    return key.split("/").pop() || "";
  };
  const { download, isInProgress } = useDownloader();
  return (
    <>
      {view === "grid" ? (
        <>
          {files.map((file, _) => (
            <div
              key={file.key}
              className="h-44 md:h-60 bg-shade/50 rounded-xl group border border-shade hover:shadow overflow-hidden relative"
            >
              <DevButton
                target="_blank"
                variant="flat"
                asIcon
                href={file.url}
                className="absolute z-10 top-1.5 hidden group-hover:flex right-1.5"
              >
                <LuSquareArrowOutUpRight />
              </DevButton>
              <div
                className={`absolute top-1.5  group-hover:!block left-1.5 ${
                  selectedS3Files.find((f) => f.key === file.key)
                    ? "!block"
                    : "!hidden"
                }`}
              >
                <DevCheckbox
                  checked={selectedS3Files.includes(file)}
                  onChange={(e) =>
                    e.target.checked
                      ? setSelectedS3Files([...selectedS3Files, file])
                      : setSelectedS3Files(
                          selectedS3Files.filter((f) => f.key !== file.key)
                        )
                  }
                />
              </div>
              <FilePreview
                url={file.url}
                filename={getFileName(file.key)}
                className="absolute inset-0"
              />

              <h3 className="absolute flex items-center *:px-2 divide-x bottom-2 text-sm max-w-[80%] bg-white/50 rounded-2xl p-1 px-2 truncate divide-shade left-1/2 -translate-x-1/2">
                <p className="truncate">{getFileName(file.key)}</p>
                <p>{normalizeFileSize(file.size)}</p>
              </h3>
              <div className="absolute z-10 translate-y-full group-hover:translate-y-0 transition-all inset-x-0 divide-x *:pr-2 divide-shade bg-white shadow bottom-0 flex items-center justify-between p-3">
                <DeleteModal
                  selectedS3Files={selectedS3Files}
                  setSelectedS3Files={setSelectedS3Files}
                  setS3Files={setS3Files}
                  S3Key={file.key}
                />
                <div className="flex items-center relative flex-grow justify-end gap-2.5 active:*:scale-95 transition-all text-xl hover:*:text-accent">
                  <DevTooltip tipData="AI Edit">
                  <button
                     onClick={() => getFileType({ url: file.url }).category === "image" ? setTransformImgKey(getFileName(file.key)) : toast.info(`Currently only images can be transformed`)}
                    className="hover:scale-105"
                  >
                    <EditImgIcon/>
                  </button>
                  </DevTooltip>
                  <DevClipboard
                    afterCopy={<IoCopy />}
                    beforeCopy={<IoCopyOutline />}
                    textClip={file.url}
                  />
                  <button
                    onClick={() => download(file.url, getFileName(file.key))}
                  >
                    <FiDownload
                      className={`${isInProgress && "animate-bounce"}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <DevTable
            data={files.map((file) => ({
              Select: (
                <div className="p-1">
                  <DevCheckbox
                    checked={selectedS3Files.includes(file)}
                    onChange={(e) =>
                      e.target.checked
                        ? setSelectedS3Files([...selectedS3Files, file])
                        : setSelectedS3Files(
                            selectedS3Files.filter((f) => f.key !== file.key)
                          )
                    }
                  />
                </div>
              ),
              Preview: (
                <div className="w-20 h-20 border border-shade rounded-xl overflow-hidden shadow">
                  <FilePreview
                    url={file.url}
                    filename={getFileName(file.key)}
                  />
                </div>
              ),
              Name: (
                <p className="max-w-52 truncate">{getFileName(file.key)}</p>
              ),
              Url: (
                <a
                  target="_blank"
                  href={file.url}
                  className="text-2xl hover:text-accent active:scale-95 transition-all"
                >
                  <LuSquareArrowOutUpRight />
                </a>
              ),
              Date: new Date(file.lastModified).toLocaleString().split(",")[0],
              Size: (
                <p className="bg-accent/20 text-accent rounded-full p-0.5 px-2 w-fit">
                  {normalizeFileSize(file.size)}
                </p>
              ),
              Actions: (
                <div className="flex items-center gap-2.5 active:*:scale-95 transition-all text-xl hover:*:text-accent">
                  <DeleteModal
                    selectedS3Files={selectedS3Files}
                    setSelectedS3Files={setSelectedS3Files}
                    setS3Files={setS3Files}
                    S3Key={file.key}
                  />
                  <button 
                   onClick={() => getFileType({ url: file.url }).category === "image" ? setTransformImgKey(getFileName(file.key)) : toast.info(`Currently only images can be transformed`)}
                  className="hover:scale-105">
                    <EditImgIcon />
                  </button>

                  <DevClipboard
                    afterCopy={<IoCopy />}
                    beforeCopy={<IoCopyOutline />}
                    textClip={file.url}
                  />
                  <button
                    onClick={() => download(file.url, getFileName(file.key))}
                  >
                    <FiDownload />
                  </button>
                </div>
              ),
            }))}
            columns={[
              { head: "Select", width: "100px" },
              { head: "Preview", width: "200px" },
              "Name",
              "Url",
              "Size",
              "Date",
              "Actions",
            ]}
          />
        </>
      )}
      {transformImgKey && (
        <DevModal
          customCloseIcon={
            <button
              onClick={() => setTransformImgKey(null)}
              className="aspect-square transition-all p-0.5 rounded-md ring ring-accent/20 active:ring-accent/50"
            >
              <IoMdClose />
            </button>
          }
          title="Image Transformation"
          open={transformImgKey ? true : false}
          modalBtn={<></>}
        >
          <TransformationModal fileKey={transformImgKey} />
        </DevModal>
      )}
    </>
  );
};

export default AssetCards;
