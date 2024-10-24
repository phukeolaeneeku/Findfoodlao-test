import React, { useEffect, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import "./styles/maps.css";
import CurrentLocation from "./CurrentLocation";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { getDistance } from "ol/sphere"; // ฟังก์ชันสำหรับคำนวณระยะทาง
import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";

function Maps() {
  const [map, setMap] = useState(null);

  // ตำแหน่ง default ที่จะใช้ในฟังก์ชันปุ่ม
  const defaultPosition = fromLonLat([102.6115, 17.9736]);

  // ฟังก์ชันสำหรับคำนวณตำแหน่งใหม่ที่ห่างออกไปในทิศต่าง ๆ
  const getOffsetPosition = (position, distance, angle) => {
    const R = 6378137; // รัศมีของโลกในหน่วยเมตร
    const lon1 = position[0] * (Math.PI / 180);
    const lat1 = position[1] * (Math.PI / 180);
    const brng = angle * (Math.PI / 180); // เปลี่ยนมุมเป็นเรเดียน

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(distance / R) +
        Math.cos(lat1) * Math.sin(distance / R) * Math.cos(brng)
    );
    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(distance / R) * Math.cos(lat1),
        Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
      );

    return [lon2 * (180 / Math.PI), lat2 * (180 / Math.PI)];
  };

  useEffect(() => {
    if (!map) {
      // ตำแหน่ง default ที่จะสร้างจุด
      const defaultPosition = fromLonLat([102.6115, 17.9736]);

      // ระยะทางในแต่ละทิศ
      const distanceNorth = 700;
      const distanceNorth2 = 800;
      const distanceNortheast = 1200;
      const distanceNortheast2 = 2500;

      const distanceEast = 2500;
      const distanceEast2 = 3500;
      const distanceSoutheast = 2500;
      const distanceSoutheast2 = 2500;

      const distanceSouth = 2000;
      const distanceSouth2 = 1700;
      const distanceSouthwest = 1500;
      const distanceSouthwest2 = 2000;


      const distanceWest = 2500;
      const distanceWest2 = 1500;
      const distanceNorthwest = 1000;
      const distanceNorthwest2 = 1000;




      // คำนวณตำแหน่งใหม่ในแต่ละทิศ (0 = ทิศเหนือ, 90 = ทิศตะวันออก, 180 = ทิศใต้, 270 = ทิศตะวันตก)
      // คำนวณตำแหน่งใหม่ในทิศเฉียง (45 = ตะวันออกเฉียงเหนือ, 135 = ตะวันออกเฉียงใต้, 225 = ตะวันตกเฉียงใต้, 315 = ตะวันตกเฉียงเหนือ)
      const northPosition = getOffsetPosition(toLonLat(defaultPosition),distanceNorth,0);
      const northPosition2 = getOffsetPosition(toLonLat(defaultPosition),distanceNorth2,22.5);
      const northeastPosition = getOffsetPosition(toLonLat(defaultPosition),distanceNortheast,45);
      const northeastPosition2 = getOffsetPosition(toLonLat(defaultPosition),distanceNortheast2,67.5);


      const eastPosition = getOffsetPosition(toLonLat(defaultPosition),distanceEast,90);
      const eastPosition2 = getOffsetPosition(toLonLat(defaultPosition),distanceEast2,112.5);
      const southeastPosition = getOffsetPosition(toLonLat(defaultPosition),distanceSoutheast,135);
      const southeastPosition2 = getOffsetPosition(toLonLat(defaultPosition),distanceSoutheast2,157.5);

      const southPosition = getOffsetPosition(toLonLat(defaultPosition),distanceSouth,180);
      const southPosition2 = getOffsetPosition(toLonLat(defaultPosition),distanceSouth2,202.5);
      const southwestPosition = getOffsetPosition(toLonLat(defaultPosition),distanceSouthwest,225);
      const southwestPosition2 = getOffsetPosition(toLonLat(defaultPosition),distanceSouthwest2,247.5);

      const westPosition = getOffsetPosition(toLonLat(defaultPosition),distanceWest,270);
      const westPosition2 = getOffsetPosition(toLonLat(defaultPosition),distanceWest2,292.5);
      const northwestPosition = getOffsetPosition(toLonLat(defaultPosition),distanceNorthwest,315);
      const northwestPosition2 = getOffsetPosition(toLonLat(defaultPosition),distanceNorthwest2,337.5);


      // สร้างเส้นปิดเชื่อมตำแหน่งทั้งหมด
      const polygonCoordinates = [
        fromLonLat(northPosition),
        fromLonLat(northPosition2),
        fromLonLat(northeastPosition),
        fromLonLat(northeastPosition2),


        fromLonLat(eastPosition),
        fromLonLat(eastPosition2),
        fromLonLat(southeastPosition),
        fromLonLat(southeastPosition2),


        fromLonLat(southPosition),
        fromLonLat(southPosition2),
        fromLonLat(southwestPosition),
        fromLonLat(southwestPosition2),


        fromLonLat(westPosition),
        fromLonLat(westPosition2),
        fromLonLat(northwestPosition),
        fromLonLat(northwestPosition2),


        fromLonLat(northPosition), // กลับไปที่จุดเริ่มต้นเพื่อปิดเส้น
      ];

      const initialMap = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          // วาดเส้นรอบตำแหน่งต่าง ๆ
          new VectorLayer({
            source: new VectorSource({
              features: [new Feature(new Polygon([polygonCoordinates]))],
            }),
            style: new Style({
              stroke: new Stroke({
                color: "red",
                width: 2,
              }),
              fill: new Fill({
                color: "rgba(255, 0, 0, 0.1)", // สีแดงอ่อนพร้อมความโปร่งใส
              }),
            }),
          }),
        ],
        view: new View({
          center: defaultPosition,
          zoom: 12,
        }),
      });
      setMap(initialMap);
    }
  }, [map]);

  // ฟังก์ชันที่เปลี่ยนมุมมองไปยังตำแหน่ง defaultPosition แบบ smooth
  const goToDefaultPosition = () => {
    if (map) {
      const view = map.getView();
      view.animate({
        center: defaultPosition, // ไปที่ตำแหน่ง default
        zoom: 13,               // ซูมไปที่ระดับ 12
        duration: 1000,          // ระยะเวลาในการ animate (2 วินาที)
      });
    }
  };

  return (
    <div id="map" className="map">
      {map && (
        <>
          <CurrentLocation map={map} goToDefaultPosition={goToDefaultPosition}/>
        </>
      )}
    </div>
  );
}

export default Maps;
