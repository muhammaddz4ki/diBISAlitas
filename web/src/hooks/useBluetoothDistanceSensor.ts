import { useState, useCallback, useRef, useEffect } from "react";

// UUID GATT Service & Characteristic (harus persis sama dengan yang dipancarkan oleh ESP32)
const BIJALAN_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const DISTANCE_CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

export function useBluetoothDistanceSensor() {
  const [distanceCm, setDistanceCm] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const deviceRef = useRef<any>(null);
  const smoothedDistanceRef = useRef<number | null>(null);

  /**
   * Menyambungkan ke modul fisik sensor jarak via Web Bluetooth API (Google Chrome / Edge di Android)
   */
  const connect = useCallback(async () => {
    setErrorMessage(null);

    if (typeof window === "undefined" || !("bluetooth" in navigator)) {
      setErrorMessage(
        "Peramban Anda belum mendukung Web Bluetooth API. Gunakan peramban Google Chrome di perangkat Android."
      );
      return;
    }

    try {
      setIsConnecting(true);

      // Membuka jendela dialog pemindaian Bluetooth bawaan browser
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ namePrefix: "BiJALAN" }],
        optionalServices: [BIJALAN_SERVICE_UUID],
      });

      deviceRef.current = device;

      // Event listener jika sambungan nirkabel terputus secara tiba-tiba
      device.addEventListener("gattserverdisconnected", () => {
        setIsConnected(false);
        setDistanceCm(null);
        smoothedDistanceRef.current = null;
      });

      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService(BIJALAN_SERVICE_UUID);
      const characteristic = await service?.getCharacteristic(DISTANCE_CHAR_UUID);

      // Mulai mendengarkan notifikasi jarak real-time dari ESP32
      await characteristic?.startNotifications();
      characteristic?.addEventListener(
        "characteristicvaluechanged",
        (event: any) => {
          const rawString = new TextDecoder().decode(event.target.value);
          const parsedValue = parseInt(rawString, 10);

          if (!isNaN(parsedValue)) {
            // Objek di luar jangkauan sensor (misal > 350-400 cm)
            if (parsedValue >= 999) {
              setDistanceCm(null);
              smoothedDistanceRef.current = null;
              return;
            }

            // Filter Exponential Moving Average (alpha = 0.6) untuk meredam jitter osilasi langkah kaki
            if (smoothedDistanceRef.current === null) {
              smoothedDistanceRef.current = parsedValue;
            } else {
              smoothedDistanceRef.current = Math.round(
                0.6 * parsedValue + 0.4 * smoothedDistanceRef.current
              );
            }

            setDistanceCm(smoothedDistanceRef.current);
          }
        }
      );

      setIsConnected(true);
    } catch (err: any) {
      if (err.name !== "NotFoundError") {
        // Abaikan jika user hanya membatalkan dialog pemilihan Bluetooth
        setErrorMessage(
          err.message || "Gagal menghubungkan ke modul sensor jarak fisik."
        );
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  /**
   * Memutuskan sambungan Bluetooth secara aman
   */
  const disconnect = useCallback(() => {
    if (deviceRef.current && deviceRef.current.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    setIsConnected(false);
    setDistanceCm(null);
    smoothedDistanceRef.current = null;
  }, []);

  // Bersihkan koneksi saat komponen di-unmount
  useEffect(() => {
    return () => {
      if (deviceRef.current && deviceRef.current.gatt?.connected) {
        deviceRef.current.gatt.disconnect();
      }
    };
  }, []);

  return {
    distanceCm,
    isConnected,
    isConnecting,
    errorMessage,
    connect,
    disconnect,
  };
}
