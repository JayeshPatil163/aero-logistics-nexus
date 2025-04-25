
import { useCallback } from 'react';
import { saveBookingToExcel } from '@/utils/excelUtils';
import { toast } from 'sonner';

export const useBookingStorage = () => {
  const saveBooking = useCallback(async (bookingData: any) => {
    try {
      const success = await saveBookingToExcel(bookingData);
      
      if (success) {
        toast.success("Booking information saved successfully!");
      }
      
      return success;
    } catch (error) {
      console.error("Error saving booking:", error);
      toast.error("Failed to save booking information.");
      return false;
    }
  }, []);

  return { saveBooking };
};

export default useBookingStorage;
