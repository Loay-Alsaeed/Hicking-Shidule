import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "../Context/AuthContext";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const ExcelExportButton = () => {
    const {user} = useAuth();
    const handleExport = async () => {
        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseUrl}/api/Employee/tripdetails/${user.user.id}`);

        const trips = await response.json();
    
        let sheetData = [];
        trips.forEach((t) => {
          const trip = t.trip;
    
          sheetData.push(
            { A: "Trip Name:", B: trip.name },
            { A: "Description:", B: trip.description },
            { A: "Location:", B: trip.location },
            { A: "Price:", B: trip.price },
            { A: "Start Date:", B: trip.startDate },
            { A: "End Date:", B: trip.endDate },
            {}
          );
    
          sheetData.push({ A: "Users:" });
          sheetData.push({ A: "User Name", B: "User Email" });
    
          if (t.tripUsers.length > 0) {
            t.tripUsers.forEach((u) => {
              sheetData.push({
                A: u.userName,
                B: u.userEmail
              });
            });
          } else {
            sheetData.push({ A: "No users registered" });
          }
    
          sheetData.push({}, {}, {});
        });
    
        const worksheet = XLSX.utils.json_to_sheet(sheetData, { skipHeader: true });
    
        worksheet["!cols"] = [
          { wch: 25 },
          { wch: 50 }
        ];
    
        Object.keys(worksheet).forEach((cell) => {
          if (cell.startsWith("A") && worksheet[cell].v === "Trip Name:") {
            worksheet[cell].s = {
              font: { bold: true, sz: 14, color: { rgb: "1F4E78" } }
            };
          }
        });
    
        Object.keys(worksheet).forEach((cell) => {
          if (worksheet[cell].v === "Users:") {
            worksheet[cell].s = {
              font: { bold: true, sz: 12, color: { rgb: "0B5394" } }
            };
          }
        });
    
        Object.keys(worksheet).forEach((cell) => {
          if (worksheet[cell].v === "User Name" || worksheet[cell].v === "User Email") {
            worksheet[cell].s = {
              font: { bold: true },
              fill: { fgColor: { rgb: "D9E1F2" } },
              border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" }
              }
            };
          }
        });
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Trips Report");
    
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array", cellStyles: true});
        saveAs(new Blob([excelBuffer]), "Trips_Report.xlsx");
      };

  return (

    <button className="bg-white shadow h-fit w-fit px-4 py-2 cursor-pointer rounded-xl flex gap-4 align-middle" onClick={handleExport}>
        <p className="text-green-900 font-bold">Explore Trips</p>
        <PiMicrosoftExcelLogoFill size={24} className="text-green-900"/>
    </button>
  );
};

export default ExcelExportButton;
