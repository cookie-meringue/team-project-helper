
import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
  onScan: (result: string) => void;
  onError: (error: string) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop();
        scanner.destroy();
      }
    };
  }, [scanner]);

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
          stopScanning();
        },
        {
          onDecodeError: (error) => {
            console.log('Decode error:', error);
          },
        }
      );

      await qrScanner.start();
      setScanner(qrScanner);
      setIsScanning(true);
    } catch (error) {
      onError('Failed to start camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.stop();
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <video
        ref={videoRef}
        className="w-full max-w-sm rounded-lg border"
        style={{ display: isScanning ? 'block' : 'none' }}
      />
      
      <div className="flex space-x-2">
        {!isScanning ? (
          <Button onClick={startScanning}>Start Camera</Button>
        ) : (
          <Button variant="outline" onClick={stopScanning}>
            Stop Scanning
          </Button>
        )}
      </div>
    </div>
  );
}
