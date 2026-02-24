import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { BillData, BluetoothPrinter } from "@/lib/thermal-printer-utils";

const LAST_PRINTER_ID_KEY = "qrave_last_printer_id";

type PrinterContextValue = {
  printer: BluetoothPrinter | null;
  isConnected: boolean;
  isConnecting: boolean;
  isPrinting: boolean;
  lastPrinterId: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  printBill: (billData: BillData) => Promise<void>;
  testPrint: () => Promise<void>;
};

const PrinterContext = createContext<PrinterContextValue | null>(null);

export function PrinterProvider({
  children,
  width = 32,
}: {
  children: React.ReactNode;
  width?: 32 | 48;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const [lastPrinterId, setLastPrinterId] = useState<string | null>(() =>
    localStorage.getItem(LAST_PRINTER_ID_KEY),
  );

  const printerRef = useRef<BluetoothPrinter | null>(null);
  if (!printerRef.current) {
    printerRef.current = new BluetoothPrinter(
      { width },
      {
        onDisconnected: () => {
          setIsConnected(false);
        },
      },
    );
  }

  const printer = printerRef.current;

  const setStoredPrinterId = useCallback((id: string | null) => {
    if (id) localStorage.setItem(LAST_PRINTER_ID_KEY, id);
    else localStorage.removeItem(LAST_PRINTER_ID_KEY);
    setLastPrinterId(id);
  }, []);

  const connect = useCallback(async () => {
    if (!printer) return;
    setIsConnecting(true);
    try {
      await printer.connect();
      setIsConnected(true);
      const id = printer.getDevice()?.id ?? null;
      if (id) setStoredPrinterId(id);

      toast.success("Printer connected", { id: "printer_connected" });
    } catch (error) {
      console.error("Printer connection error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to connect to printer");
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [printer, setStoredPrinterId]);

  const disconnect = useCallback(async () => {
    if (!printer) return;
    try {
      await printer.disconnect();
      setIsConnected(false);
      toast.success("Printer disconnected", { id: "printer_disconnected" });
    } catch (error) {
      console.error("Printer disconnect error:", error);
      toast.error("Failed to disconnect printer");
    }
  }, [printer]);

  const printBill = useCallback(
    async (billData: BillData) => {
      if (!printer) {
        toast.error("Printer not initialized");
        return;
      }
      if (!isConnected) {
        toast.error("Printer not connected. Please connect first.");
        return;
      }

      const debug = localStorage.getItem("qrave_printer_debug") === "1";
      if (debug) {
        console.log("[printer] Printing bill:", {
          billNumber: billData.bill.billNumber,
          totals: billData.totals,
        });
      }

      setIsPrinting(true);
      try {
        await printer.printBill(billData);
        toast.success("Bill printed successfully");
      } catch (error) {
        console.error("Print error:", error);
        toast.error(error instanceof Error ? error.message : "Failed to print bill");
      } finally {
        setIsPrinting(false);
      }
    },
    [printer, isConnected],
  );

  const testPrint = useCallback(async () => {
    if (!printer) {
      toast.error("Printer not initialized");
      return;
    }
    if (!isConnected) {
      toast.error("Printer not connected. Please connect first.");
      return;
    }
    setIsPrinting(true);
    try {
      await printer.testPrint();
      toast.success("Test print completed");
    } catch (error) {
      console.error("Test print error:", error);
      toast.error("Test print failed");
    } finally {
      setIsPrinting(false);
    }
  }, [printer, isConnected]);

  const value = useMemo<PrinterContextValue>(
    () => ({
      printer,
      isConnected,
      isConnecting,
      isPrinting,
      lastPrinterId,
      connect,
      disconnect,
      printBill,
      testPrint,
    }),
    [printer, isConnected, isConnecting, isPrinting, lastPrinterId, connect, disconnect, printBill, testPrint],
  );

  return <PrinterContext.Provider value={value}>{children}</PrinterContext.Provider>;
}

export function usePrinter(): PrinterContextValue {
  const ctx = useContext(PrinterContext);
  if (!ctx) throw new Error("usePrinter must be used within PrinterProvider");
  return ctx;
}
