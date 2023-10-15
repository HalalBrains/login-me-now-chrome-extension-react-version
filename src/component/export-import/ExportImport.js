import React, { useRef, useState } from "react";
import Header from "../add-new-site/add-new-site-components/Header";
import exportFromJSON from "export-from-json";

function ExportImport() {
    const [fileName, setFileName] = useState(undefined)
    const [tokens, setTokens] = useState()
  const handleExport = () => {
    const data = tokens;
    const fileName = "LMN Exported Data";
    const exportType = exportFromJSON.types.json;

    exportFromJSON({ data, fileName, exportType });
  };

  const handleImport = () => {


    const fileInput = fileInputRef.current;    
    const selectedFile = fileInput.files[0];
    setFileName(selectedFile.name)

    if (fileInput.files.length === 0) {
      alert("Please select a JSON file to import.");
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        console.log("Imported JSON Data:", jsonData);
      } catch (error) {
        alert("Error parsing JSON file: " + error.message);
      }
    };

    reader.readAsText(file);
  };

  const fileInputRef = useRef();

  const handleImportButtonClick = () => {
    // Trigger a click event on the hidden file input element
    fileInputRef.current.click();
  };

  // eslint-disable-next-line no-undef
  chrome.storage.local.get({ loginMeNowTokens: {} }, function (data) {
    let tokens = data.loginMeNowTokens ? data.loginMeNowTokens : {};
    setTokens(tokens)
  })
  return (
    <>
      <Header title="Export and Import data" />
      <div className="h-[528px] flex justify-center items-center flex-col">
        <button
          className="bg-[#005e54] text-white text-[18px] py-2.5 px-10 mb-5 block rounded-full"
          onClick={handleExport}
        >
          Export
        </button>
        
        <label
          htmlFor="fileInput"
          className="bg-[#005e54] text-white text-[18px] py-2.5 px-10 block rounded-full cursor-pointer"
          onClick={handleImportButtonClick}
        >
          Import
        </label>
        <input
          className="hidden"
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleImport}
        />
        <p className="mt-2">{fileName}</p>
      </div>
    </>
  );
}

export default ExportImport;