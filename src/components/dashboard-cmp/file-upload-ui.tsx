import React, { useEffect, useRef } from "react";

const FileUploadUi = () => {
  const openFolderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  
    if (openFolderRef.current) {
       setTimeout(() => {
        openFolderRef?.current?.classList.add("folderOpen");
       }, 100);
      }
  }, []);

  return (
    <div className="container relative">
        <div ref={openFolderRef} className="folder">
          <div className="front-side">
            <div className="tip"></div>
            <div className="cover"></div>
          </div>
          <div className="back-side cover"></div>
        </div>
      </div>
  
  );
};

export default FileUploadUi;
