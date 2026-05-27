<<<<<<< Updated upstream
import QrScanner from './components/QrScanner'


const App = () => {
=======
import { useState } from "react";

function App() {
  const [scanning, setScanning] = useState(false);

>>>>>>> Stashed changes
  return (
    <div style={styles.container}>
      
      <div style={styles.card}>
        <h1 style={styles.title}>📷 QR Scanner</h1>

        {!scanning ? (
          <button
            style={styles.button}
            onClick={() => setScanning(true)}
          >
            Start Scanning
          </button>
        ) : (
          <p style={styles.activeText}>Camera Active...</p>
        )}

        {/* Scanner Box */}
        <div style={styles.scanBox}>
          <div style={styles.scanLine}></div>
        </div>

        <button style={styles.uploadBtn}>
          Upload QR Image
        </button>
      </div>
    </div>
  );
}

<<<<<<< Updated upstream
export default App

=======
const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(15px)",
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    width: "320px",
    color: "white",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },

  title: {
    marginBottom: "20px",
  },

  button: {
    background: "#00c853",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  activeText: {
    color: "#00e676",
  },

  scanBox: {
    marginTop: "20px",
    width: "200px",
    height: "200px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderRadius: "10px",
    marginInline: "auto",
    position: "relative",
    overflow: "hidden",
  },

  scanLine: {
    width: "100%",
    height: "3px",
    background: "#00e676",
    position: "absolute",
    animation: "scan 2s linear infinite",
  },

  uploadBtn: {
    marginTop: "20px",
    background: "transparent",
    border: "1px solid #ccc",
    padding: "8px 15px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};

export default App;
>>>>>>> Stashed changes
