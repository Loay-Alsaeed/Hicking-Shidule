import React, { useState } from "react";
import axios from "axios";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const DownloadExcelWithProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isdownload, setIsDowmload] = useState(false);

  const handleDownload = async () => {
        setProgress(0);
        setIsDowmload(true);
        const baseUrl = import.meta.env.VITE_API_URL;
    
        const response = await axios.get(
          `${baseUrl}/api/Employee/download`,
          {
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const pct = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
                setProgress(pct);
              }
            },
          }
        );
    
        // إنشاء رابط للملف وتحميله
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Trips_Report.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
        setIsDowmload(false);
        setFlie(a);
    

  };

  return (
    <div>
        {isdownload? (<>
            <div className="flex gap-1" style={{ marginTop: 10 }}>
                <div style={{
                height: "20px",
                width: "170px",
                border: "1px solid #ccc",
                borderRadius: 5
                }}>
                <div style={{
                    height: "100%",
                    width: `${progress}%`,
                    backgroundColor: "#4caf50",
                    transition: "0.2s"
                }} />
                </div>
                <p>{progress}%</p>
            </div></>):(<>
        <button  className="bg-white shadow h-fit w-full min-w-[170px] px-4 py-2 cursor-pointer rounded-xl flex gap-4 align-middle" onClick={handleDownload}>
            <p className="text-green-900 font-bold">Explore Trips</p>
            <PiMicrosoftExcelLogoFill size={24} className="text-green-900"/>
        </button>
      </>)}
      


    </div>
  );
};

export default DownloadExcelWithProgress;
