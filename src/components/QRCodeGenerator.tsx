
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
}

export function QRCodeGenerator({ value, size = 200 }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(value, { width: size, margin: 1 })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));
  }, [value, size]);

  return (
    <div className="flex flex-col items-center space-y-2">
      {qrCodeUrl && (
        <img src={qrCodeUrl} alt="QR Code" className="border rounded-lg" />
      )}
      <p className="text-sm text-muted-foreground text-center">
        Team members can scan this QR code to join
      </p>
    </div>
  );
}
