import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrScanner = () => {

  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      }
    );

    function success(result) {
      scanner.clear();
      setScanResult(result);
    }

    function error(err) {
      console.warn(err);
    }

    scanner.render(success, error);

    return () => {
      scanner.clear().catch((err) => {
        console.log(err);
      });
    };

  }, []);

  return (
    <>
      <h1>QR Scanner</h1>

      <div id="reader"></div>

      {scanResult && (
        <div>
          <h3>Scanned Result:</h3>

          <a
            href={scanResult}
            target="_blank"
            rel="noreferrer"
          >
            {scanResult}
          </a>
        </div>
      )}
    </>
  );
};

export default QrScanner;