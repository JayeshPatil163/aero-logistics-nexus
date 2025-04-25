
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Function to generate and download Excel file
export const generateExcelReport = (data: any[], fileName: string) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
    // Try to save to Documents/AirCargoSchedules on Mac
    try {
      const path = `${getDocumentsPath()}/AirCargoSchedules/${fileName}`;
      const buffer = XLSX.write(workbook, { type: "buffer" });
      
      // This is for browser compatibility - will trigger a download
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, fileName);
      
      // Show success message
      console.log(`Report generated: ${fileName}`);
      return true;
    } catch (err) {
      console.error("Error saving file to Documents folder:", err);
      
      // Fallback: Just download the file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, fileName);
      return true;
    }
  } catch (err) {
    console.error("Error generating Excel report:", err);
    return false;
  }
};

// Helper function to get documents path (Note: this is simplified as browsers can't directly access file system paths)
const getDocumentsPath = () => {
  // In a real app with Electron or a backend, you would implement actual file system access
  // For browser-only apps, we can only trigger downloads
  return "Documents";
};

// Save booking data to excel
export const saveBookingToExcel = async (bookingData: any) => {
  try {
    // Read existing bookings or create new file
    let bookings: any[] = [];
    
    // In a full implementation, you would read the existing file first
    // For now, we'll just add the new booking to our array
    bookings.push(bookingData);
    
    const fileName = "AirCargo_Bookings.xlsx";
    return generateExcelReport(bookings, fileName);
  } catch (err) {
    console.error("Error saving booking to Excel:", err);
    return false;
  }
};
