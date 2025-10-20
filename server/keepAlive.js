// 🔁 RentXpress Backend KeepAlive (by Waman Patil)
import axios from "axios";

const BACKEND_URL = "https://rentxpress.onrender.com/api";

async function keepAlive() {
  try {
    const res = await axios.get(BACKEND_URL);
    console.log(`💓 KeepAlive: ${res.status} - Server is awake!`);
  } catch (err) {
    console.error("⚠️ KeepAlive failed:", err.message);
  }
}

// 🔁 Ping backend every 10 minutes
setInterval(keepAlive, 10 * 60 * 1000);

// Run once immediately when deployed
keepAlive();
