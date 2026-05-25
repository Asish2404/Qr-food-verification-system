import React, { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./Qr.css";

const QrScanner = () => {

  const scannerRef = useRef(null);

  const [scanResult, setScanResult] = useState("");

  const [isScanning, setIsScanning] = useState(false);

  const [loading, setLoading] = useState(false);

  const redeemQr = async (decodedText) => {

    try {

      setLoading(true);

      console.log("QR DATA:", decodedText);

      const response = await fetch(
        "http://127.0.0.1:8000/redeem",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            qr_data: decodedText
          }),
        }
      );

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      setScanResult(data.message);

    } catch (err) {

      console.log(err);

      setScanResult("Backend Error");

    } finally {

      setLoading(false);
    }
  };

  const startScanner = async () => {

    try {

      if (isScanning) return;

      if (!scannerRef.current) {

        scannerRef.current = new Html5Qrcode("reader");
      }

      await scannerRef.current.start(

        { facingMode: "environment" },

        {
          fps: 10,

          qrbox: {
            width: 280,
            height: 280,
          },

          aspectRatio: 1.0,
        },

        async (decodedText) => {

          console.log("SCANNED:", decodedText);

          await redeemQr(decodedText);

          await stopScanner();
        },

        (errorMessage) => {

          console.log(errorMessage);
        }
      );

      setIsScanning(true);

    } catch (err) {

      console.log("Scanner Start Error:", err);

      alert("Unable to access camera");
    }
  };

  const stopScanner = async () => {

    try {

      if (scannerRef.current && isScanning) {

        await scannerRef.current.stop();

        setIsScanning(false);
      }

    } catch (err) {

      console.log("Scanner Stop Error:", err);
    }
  };

  const scanImage = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    try {

      if (!scannerRef.current) {

        scannerRef.current = new Html5Qrcode("reader");
      }

      if (isScanning) {

        await stopScanner();
      }

      const result = await scannerRef.current.scanFile(
        file,
        true
      );

      console.log("IMAGE RESULT:", result);

      await redeemQr(result);

    } catch (err) {

      console.log("Image Scan Error:", err);

      alert("No QR code found in image");
    }
  };

  return (

    <div className="container">

      <div className="left-panel">

        <h1 className="header">
          QR Scanner
        </h1>

        <div id="reader"></div>

        <div className="button-group">

          {!isScanning ? (

            <button
              className="scan-btn"
              onClick={startScanner}
            >
              Start Scanning
            </button>

          ) : (

            <button
              className="stop-btn"
              onClick={stopScanner}
            >
              Stop Scanning
            </button>

          )}

        </div>

        <div className="upload-section">

          <label className="upload-label">
            Upload QR Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={scanImage}
          />

        </div>

      </div>

      <div className="right-panel">

        <h2 className="result-title">
          Scan Result
        </h2>

        {loading && (

          <div className="result-box">
            Processing QR...
          </div>

        )}

        {scanResult && !loading && (

          <div className="result-box">

            <h3>
              Status
            </h3>

            <pre className="result-text">
              {scanResult}
            </pre>

          </div>

        )}

      </div>

    </div>
  );
};

export default QrScanner;