import React from 'react';
import DevCheckbox from '../dev-components/dev-checkbox';
import DeleteModal from './delete-modal';
import { GoShareAndroid } from 'react-icons/go';
import { FiDownload } from 'react-icons/fi';
import JSZip from 'jszip';
import { S3File } from '../../utils/s3-actions';
import { saveAs } from 'file-saver';

type Props = {
    selectedS3Files: S3File[];
    setSelectedS3Files: React.Dispatch<React.SetStateAction<S3File[]>>;
    setS3Files: React.Dispatch<React.SetStateAction<S3File[]>>;
}

const SelectBar = ({ selectedS3Files, setSelectedS3Files, setS3Files }: Props) => {

    const handleBulkDownload = async () => {
        const zip = new JSZip();
    
        for (const file of selectedS3Files) {
          try {
            const response = await fetch(file.url);
            if (!response.ok) throw new Error(`Failed to fetch ${file.key}`);
            const blob = await response.blob();
            zip.file(file.key, blob);
          } catch (error) {
            console.error(`Error downloading ${file.key}:`, error);
          }
        }
    
        try {
          const content = await zip.generateAsync({ type: "blob" });
          saveAs(content, "download.zip");
        } catch (error) {
          console.error("Error generating zip file:", error);
        }
    };

    const handleShare = async () => {
        if (selectedS3Files.length === 0) {
            console.error('No files selected for sharing');
            return;
        }

        try {
            if (navigator.canShare) {
                const shareData = {
                    title: 'Shared Files',
                    text: `Sharing ${selectedS3Files.length} files`,
                    url: selectedS3Files.map(file => file.url).join('\n')
                };

                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                    return;
                }
            }

            const textarea = document.createElement('textarea');
            const fileLinks = selectedS3Files
                .map(file => file.url)
                .join('\n');
            
            textarea.value = fileLinks;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            alert('File links copied to clipboard!');

        } catch (error) {
            console.error('Error in share handler:', error);
            window.open(selectedS3Files[0].url, '_blank');
        }
    };

    return (
        <div
            className={`flex items-center z-50 gap-3 justify-between p-5 rounded-2xl bg-slate-50 fixed max-w-5xl border mx-auto shadow-md transition-all inset-x-5 bottom-5 ${
                selectedS3Files.length > 0 ? "translate-y-0" : "translate-y-[200%]"
            }`}
        >
            <div className="flex items-center gap-3">
                <DevCheckbox
                    checked={selectedS3Files.length > 0}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedS3Files(selectedS3Files);
                        } else {
                            setSelectedS3Files([]);
                        }
                    }}
                />
                <p>{selectedS3Files.length} {selectedS3Files.length > 1 ? "Files" : "File"} Selected</p>
            </div>
            <div className="flex items-center flex-grow justify-end gap-2.5 active:*:scale-95 transition-all text-xl hover:*:text-accent">
                <DeleteModal
                    selectedS3Files={selectedS3Files}
                    setSelectedS3Files={setSelectedS3Files}
                    setS3Files={setS3Files}
                />
                <button 
                    onClick={handleShare}
                    className="hover:scale-105"
                    aria-label="Share files"
                    disabled={selectedS3Files.length === 0}
                >
                    <GoShareAndroid />
                </button>
                <button 
                    onClick={handleBulkDownload}
                    aria-label="Download files"
                    disabled={selectedS3Files.length === 0}
                >
                    <FiDownload />
                </button>
            </div>
        </div>
    );
};

export default SelectBar;