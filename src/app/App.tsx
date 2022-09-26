import { useState, useEffect } from "react";
import L, { latLng } from "leaflet";
import styles from "./app.module.scss";
import pattern from "../assets/images/pattern-bg.png";
import arrow from "../assets/images/icon-arrow.svg";
import location from "../assets/images/icon-location.svg";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ipRes, setIpRes] = useState<any>({});
  const handleSubmit = async () => {
    const res = await fetch(
      "https://geo.ipify.org/api/v2/country,city?" +
        new URLSearchParams({
          apiKey: import.meta.env.VITE_IPIFY_API_KEY,
          domain: searchTerm,
          ipAddress: searchTerm,
        }),
      { method: "get" }
    );
    const data = await res.json();
    setIpRes(data);
  };

  useEffect(() => {
    let map: L.Map | undefined = undefined;
    if (ipRes?.location) {
      map = L.map("map", {
        center: [ipRes?.location.lat, ipRes?.location.lng],
        zoom: 13,
        zoomControl: false,
      });
      L.marker([ipRes?.location.lat, ipRes?.location.lng], {
        icon: L.icon({
          iconUrl: location,
        }),
      }).addTo(map);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);
    }

    return () => {
      map?.remove();
    };
  }, [ipRes]);
  return (
    <div className={styles.app}>
      <header>
        <picture>
          <img src={pattern} alt="pattern" />
        </picture>
        <section className={styles.container}>
          <h1>IP Address Tracker</h1>
          <div
            className={styles.input}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          >
            <input
              type="text"
              placeholder="Search for any IP address or domain"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="button" onClick={handleSubmit}>
              <img src={arrow} alt="arrow" />
            </button>
          </div>
          {ipRes?.ip && (
            <div className={styles.result}>
              <section className={styles.address}>
                <h2>ip address</h2>
                <p>{ipRes?.ip}</p>
              </section>
              <section className={styles.location}>
                <h2>location</h2>
                <p>
                  {ipRes?.location.region}, {ipRes?.location.country}{" "}
                  {ipRes?.location.postalCode}
                </p>
              </section>
              <section className={styles.timezone}>
                <h2>timezone</h2>
                <p>UTC {ipRes?.location.timezone}</p>
              </section>
              <section className={styles.isp}>
                <h2>isp</h2>
                <p>{ipRes?.isp}</p>
              </section>
            </div>
          )}
        </section>
      </header>
      <div className={styles.map} id="map"></div>
    </div>
  );
}

export default App;
