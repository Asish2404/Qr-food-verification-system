import { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./Qr.css";

const QrScanner = () => {

  const scannerRef = useRef(null);

  const [scanResult, setScanResult] = useState(null);

  const [counts, setCounts] = useState({
    veg: 0,
    nonveg: 0
  });

  const [isScanning, setIsScanning] = useState(false);

  const [loading, setLoading] = useState(false);

  const delay = (ms) =>
    new Promise((resolve) =>
      setTimeout(resolve, ms));

  const redeemQr = async (decodedText) => {

    try {

      setScanResult(null);

      setLoading(true);

      console.log("QR DATA:", decodedText);

      await delay(1500);

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

      await delay(1000);

      setScanResult(data);

      if (data.counts) {

        setCounts({
          veg: data.counts.veg,
          nonveg: data.counts.nonveg
        });
      }

    } catch (err) {

      console.log(err);

      setScanResult({
        success: false,
        message: "Backend Error"
      });

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

          await stopScanner();

          await redeemQr(decodedText);
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

      if (scannerRef.current) {

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

        <p className="header">
          QR Scanner
        </p>

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

          <p className="upload-label">
            Upload QR Image
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={scanImage}
          />

        </div>

      </div>

      <div className="right-panel">

        <p className="result-title">
          Scan Result
        </p>

        <div className="count-box">

          <div className="count-card">

            <p className="count-heading">
              Veg
            </p>

            <p className="count-number">
              {counts.veg}
            </p>

          </div>

          <div className="count-card">

            <p className="count-heading">
              Non-Veg
            </p>

            <p className="count-number">
              {counts.nonveg}
            </p>

          </div>

        </div>

        {loading && (

          <div className="result-box">

            <div className="loader"></div>

            <p>
              Processing QR...
            </p>

          </div>

        )}

        {scanResult && !loading && (

          <div className="result-box">

            <p className="status-title">
              Status
            </p>

            <div className="result-text">

              <p>
                <strong>Message:</strong>
                {" "}
                {scanResult.message}
              </p>

              {scanResult.qr_data && (

                <>

                  <p>
                    <strong>Coupon ID:</strong>
                    {" "}
                    {scanResult.qr_data.coupon_id}
                  </p>

                  <p>
                    <strong>Product ID:</strong>
                    {" "}
                    {scanResult.qr_data.pid}
                  </p>

                  <p>
                    <strong>Food Preference:</strong>
                    {" "}
                    {scanResult.qr_data.food_preference}
                  </p>

                </>

              )}

            </div>

          </div>

        )}

      </div>

    </div>

  );
};

export default QrScanner;