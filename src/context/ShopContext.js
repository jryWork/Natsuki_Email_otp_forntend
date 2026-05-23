import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import dayjs from "dayjs";

import { appFirebase } from "../component/firebase";
import { Row } from "antd";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [shop, setShop] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const loadShop = async () => {
      try {
        setLoading(true);

        const currentHost = window.location.hostname;

        console.log("CURRENT HOST =>", currentHost);

        const db = getDatabase(appFirebase);

        const q = query(
          ref(db, "shops"),
          orderByChild("url"),
          equalTo(currentHost),
        );

        const snapshot = await get(q);

        // helper set icon
        const setIcon = (rel, href) => {
          let link = document.querySelector(`link[rel='${rel}']`);

          if (!link) {
            link = document.createElement("link");
            link.rel = rel;

            document.head.appendChild(link);
          }

          link.href = href;
        };

        // helper set meta property
        const setMetaProperty = (property, content) => {
          let meta = document.querySelector(`meta[property='${property}']`);

          if (!meta) {
            meta = document.createElement("meta");

            meta.setAttribute("property", property);

            document.head.appendChild(meta);
          }

          meta.setAttribute("content", content);
        };

        // helper set meta name
        const setMetaName = (name, content) => {
          let meta = document.querySelector(`meta[name='${name}']`);

          if (!meta) {
            meta = document.createElement("meta");

            meta.setAttribute("name", name);

            document.head.appendChild(meta);
          }

          meta.setAttribute("content", content);
        };

        if (snapshot.exists()) {
          const data = snapshot.val();

          const shopData = Object.values(data)[0];

          setShop(shopData);

          // =========================
          // TITLE
          // =========================
          if (shopData?.shopName) {
            document.title = shopData.shopName;
          }

          // =========================
          // ICONS
          // =========================
          if (shopData?.logo?.url) {
            // favicon
            setIcon("icon", shopData.logo.url);

            // browser เก่า
            setIcon("shortcut icon", shopData.logo.url);

            // iPhone / iPad
            setIcon("apple-touch-icon", shopData.logo.url);
          }

          // =========================
          // SEO / SOCIAL META
          // =========================

          const title = shopData?.shopName || "Tomoru OTP";

          // const description =
          //   shopData?.description ||
          //   "Tomoru OTP ระบบดูรหัสยืนยัน Netflix และ Disney+";

          const image =
            shopData?.logo?.url || `${window.location.origin}/icon.png`;

          const url = window.location.href;

          // Open Graph
          setMetaProperty("og:type", "website");

          setMetaProperty("og:title", title);

          // setMetaProperty("og:description", description);

          setMetaProperty("og:image", image);

          setMetaProperty("og:url", url);

          // Twitter
          setMetaProperty("twitter:card", "summary_large_image");

          setMetaProperty("twitter:title", title);

          // setMetaProperty("twitter:description", description);

          setMetaProperty("twitter:image", image);

          // General SEO
          // setMetaName("description", description);

          // Theme Color
          if (shopData?.themeColor) {
            setMetaName("theme-color", shopData.themeColor);
          }
        } else {
          console.log("Shop not found");

          setShop(null);
        }
      } catch (err) {
        console.log(err);

        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (shop) {
    }
    if (!shop?.backgroundImage?.url) {
      root.style.setProperty("--bg-image", "none");
    } else {
      root.style.setProperty(
        "--bg-image",
        `url(${shop?.backgroundImage?.url})`,
      );
    }
  }, [shop]);

  const value = useMemo(
    () => ({
      shop,
      loading,
      error,
    }),
    [shop, loading, error],
  );
  const expiredDate = shop?.expiredDate
    ? shop?.expiredDate
    : dayjs()?.add(1, "year")?.format("YYYY-MM-DD");
  const isNotExpired = dayjs().isBefore(dayjs(expiredDate, "YYYY-MM-DD"));
  if (shop && (shop?.isOn === false || !isNotExpired)) {
    return (
      <Row justify={"center"} align={"middle"} style={{ height: "100vh" }}>
        <h1 style={{ color: "white" }}>ไม่เปิดทำการ</h1>
      </Row>
    );
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
