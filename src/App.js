import { useState, useEffect } from "react";
import "./App.css";
import { Image, Skeleton, Spin } from "antd";
import FadeIn from "./component/fadeIn";
import { Routes, Route } from "react-router-dom";
import Login from "./page/login";
import Admin from "./page/admin";
import { CaretDownOutlined, LoadingOutlined } from "@ant-design/icons";
import { useShop } from "../src/context/ShopContext";
import SearchPage from "./Search";
import { Row } from "antd";

const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

const isInStandaloneMode = () =>
  window.navigator.standalone === true ||
  window.matchMedia("(display-mode: standalone)").matches;

function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [showA2HS, setShowA2HS] = useState(false);
  const { shop, loading } = useShop();
  useEffect(() => {
    if (!isIos()) return;

    if (isInStandaloneMode()) {
      setShowA2HS(false);
      return;
    }

    const dismissed = localStorage.getItem("a2hs-dismissed");
    if (!dismissed) {
      setShowA2HS(true);
    }
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (isInStandaloneMode()) {
        setShowA2HS(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const AppShop = [
    {
      name: "NetFlix",
      appCode: "NF",
      borderAndShadowColor: "rgb(230 3 11)",
      defaultImage: "Netflix_icon.png",
    },
    {
      name: "DisneyPlus",
      appCode: "DN",
      borderAndShadowColor: "rgb(16 60 85)",
      defaultImage: "Disney_plus_icon.jpg",
    },
    {
      name: "TrueId",
      appCode: "TM",
      borderAndShadowColor: "rgb(156 27 27)",
      defaultImage: "trueid.webp",
    },
    {
      name: "GPT",
      appCode: "GPT",
      borderAndShadowColor: "rgb(15, 108, 82)",
      defaultImage: "gptIcon.jpg",
    },
    {
      name: "Prime",
      appCode: "PR",
      borderAndShadowColor: "rgb(15, 74, 108)",
      defaultImage: "prime.webp",
    },
  ];
  const renderContent = () => {
    switch (currentView) {
      case "landing":
        return (
          <div
            className="hero hide-scrollbar"
            style={{
              marginBottom: "10px",
              marginTop: "15px",
              minHeight: "2vh",
            }}
          >
            <nav>
              <span>
                <img
                  width={100}
                  height={100}
                  className="imageAppPage"
                  style={{
                    objectFit: "contain",
                  }}
                  src={
                    shop?.logo?.url
                      ? shop?.logo?.url
                      : "https://img.rdcw.co.th/images/72e07a0ede77c82ee26addc2720f81aba8a1f093a3f2eca4cc3c2cc392ab0525.png"
                  }
                  alt={shop ? shop?.shopName : "Tomoru"}
                />
              </span>
            </nav>

            <FadeIn>
              <h1 style={{ fontSize: "24px", color: shop?.color || "white" }}>
                ยินดีต้อนรับสู่ {shop ? shop?.shopName : "Tomoru"} OTP
              </h1>
              <p
                style={{
                  fontSize: "16px",
                  marginTop: "25px",
                  color: shop?.color || "white",
                }}
              >
                เลือกแอปที่ต้องการรับรหัสยืนยัน
              </p>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <CaretDownOutlined style={{ fontSize: 30 }} />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 120px)",
                  justifyContent: "center",
                  gap: "20px",
                  marginTop: 0,
                }}
              >
                {AppShop?.map((item, index) => {
                  const currentShop = shop?.appSetting?.find(
                    (app) => app.appCode === item.appCode,
                  );

                  if (!currentShop?.isOn && shop) return null;

                  return (
                    <Image
                      key={index}
                      preview={false}
                      onClick={() => handleViewChange(item.appCode)}
                      style={{
                        width: "120px",
                        border: `1px solid ${currentShop?.shadowColor ? currentShop?.shadowColor : item.borderAndShadowColor}`,
                        boxShadow: `${currentShop?.shadowColor ? currentShop?.shadowColor : item.borderAndShadowColor} 0px 4px 0px 0px`,
                        borderRadius: 29,
                        objectFit: "contain",
                      }}
                      src={
                        currentShop?.logo?.url
                          ? currentShop?.logo?.url
                          : item.defaultImage
                      }
                      alt={`${item.appCode}_logo`}
                    />
                  );
                })}
              </div>
            </FadeIn>
          </div>
        );

      case "DN":
        return <SearchPage setCurrentView={setCurrentView} appCode={"DN"} />;

      case "NF":
        return <SearchPage setCurrentView={setCurrentView} appCode={"NF"} />;

      case "TM":
        return <SearchPage setCurrentView={setCurrentView} appCode={"TM"} />;
      case "GPT":
        return <SearchPage setCurrentView={setCurrentView} appCode={"GPT"} />;
      case "PR":
        return <SearchPage setCurrentView={setCurrentView} appCode={"PR"} />;
      default:
        return <div>เกิดข้อผิดพลาด</div>;
    }
  };

  if (loading) {
    return (
      <Row style={{ height: "50vh" }} align={"middle"} justify={"center"}>
        <Spin
          spinning
          indicator={<LoadingOutlined style={{ fontSize: "40px" }} />}
        />
      </Row>
    );
  }

  return (
    <>
      {showA2HS && (
        <div className="a2hs-popup">
          <div style={{ fontWeight: 700, marginBottom: 4 }}>
            เพิ่ม {shop ? shop?.shopName : "Tomoru"} Web-app ไปหน้าจอหลัก
          </div>

          <div style={{ fontSize: 13 }}>
            กดปุ่ม{" "}
            <img
              src="/shareios.png"
              width={18}
              style={{ verticalAlign: "middle" }}
              alt="Share"
            />{" "}
            แล้วเลือก <b>Add to Home Screen</b>
          </div>

          <button
            onClick={() => {
              localStorage.setItem("a2hs-dismissed", "1");
              setShowA2HS(false);
            }}
          >
            เข้าใจแล้ว
          </button>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <CaretDownOutlined style={{ fontSize: 30 }} />
          </div>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">{renderContent()}</header>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/assmin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
