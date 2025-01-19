import React, { useState } from "react";
import DevModal from "../dev-components/dev-modal";
import { deleteFileFromS3, S3File } from "../../utils/s3-actions";
import { toast } from "sonner";
import { IoMdClose } from "react-icons/io";
import DevButton from "../dev-components/dev-button";
import { IoTrashBinOutline } from "react-icons/io5";

type Props = {
  selectedS3Files: S3File[];
  setSelectedS3Files: React.Dispatch<React.SetStateAction<S3File[]>>;
  setS3Files: React.Dispatch<React.SetStateAction<S3File[]>>;
  S3Key?: string;
  
};
const DeleteModal = ({
  selectedS3Files,
  setSelectedS3Files,
  setS3Files,
  S3Key
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const handleDeleteS3Files = async (key?: string) => {
    key
      ? await deleteFileFromS3([key])
      : await deleteFileFromS3(selectedS3Files.map((f) => f.key));
      setS3Files((prevFiles) =>
        prevFiles.filter((f) =>
          key ? f.key !== key : !selectedS3Files.includes(f)
        )
      );
    toast.success(`Selected ${key ? "file" : "files"} deleted successfully!`);
    setOpen(false);
    setSelectedS3Files([]);
  };
  return (
    <DevModal
      open={isOpen}
      title="Delete File"
      customCloseIcon={
        <button
          onClick={() => setOpen(false)}
          className="aspect-square transition-all p-0.5 rounded-md ring ring-accent/20 active:ring-accent/50"
        >
          <IoMdClose />
        </button>
      }
      defaultOpen={false}
      modalBtn={
        <button
          onClick={() => setOpen(true)}
          className="!text-red-500 active:scale-95 transition-all !text-xl"
        >
          <IoTrashBinOutline />
        </button>
      }
    >
      <div className="flex max-w-md flex-col gap-3 w-full p-3 space-y-3">
        <h2 className="text-lg font-semibold">
          Are you sure you want to{" "}
          <span className="bg-red-500/20 text-red-600  text-base rounded-full px-2">
            Delete
          </span>{" "}
          {selectedS3Files.length > 1 ? "these files" : "this file"}
        </h2>
        <div className="flex items-center gap-2 justify-end">
          <DevButton variant="flat" onClick={() => setOpen(false)}>
            No, Cancel
          </DevButton>
          <DevButton onClick={() => handleDeleteS3Files(S3Key)}>
            Yes, Delete
          </DevButton>
        </div>
      </div>
    </DevModal>
  );
};

export default DeleteModal;
