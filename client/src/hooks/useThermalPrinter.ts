import type { BillData, BluetoothPrinter } from "@/lib/thermal-printer-utils";
import { usePrinter } from "@/context/PrinterContext";

interface UseThermalPrinterReturn {
  printer: BluetoothPrinter | null;
  isConnected: boolean;
  isConnecting: boolean;
  isPrinting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  printBill: (billData: BillData) => Promise<void>;
  testPrint: () => Promise<void>;
}

/**
 * Backwards-compatible hook.
 *
 * Printer connection is managed globally by PrinterProvider so pages don't need
 * to reconnect repeatedly.
 */
export function useThermalPrinter(_printerWidth: 32 | 48 = 32): UseThermalPrinterReturn {
  const { printer, isConnected, isConnecting, isPrinting, connect, disconnect, printBill, testPrint } = usePrinter();

  return {
    printer,
    isConnected,
    isConnecting,
    isPrinting,
    connect,
    disconnect,
    printBill,
    testPrint,
  };
}
