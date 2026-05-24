import { useState, useEffect } from "react";
import "./App.css";
import { Image } from "antd";
import FadeIn from "./component/fadeIn";
import { Routes, Route } from "react-router-dom";
import Login from "./page/login";
import Admin from "./page/admin";
import { CaretDownOutlined } from "@ant-design/icons";
import SearchPage from "./Search";

const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

const isInStandaloneMode = () =>
  window.navigator.standalone === true ||
  window.matchMedia("(display-mode: standalone)").matches;

function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [showA2HS, setShowA2HS] = useState(false);

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
      defaultImage: "Netflix_icon.png",
      color: "#c22424",
    },
  ];

  const renderContent = () => {
    switch (currentView) {
      case "landing":
        return (
          
          <div className="landing-page hide-scrollbar">
            <FadeIn>

              <h1 className="main-title">
                WONDERLAND
                <br />
                STXR 💌
              </h1>

            <p
  className="sub-title"
  style={{
    textAlign: "center",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  เลือกแพลตฟอร์มที่ต้องการค้นหาอีเมล
</p>

<div
  className="down-icon"
  style={{
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <CaretDownOutlined />
</div>

              <div className="app-grid">
                {AppShop?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="app-card"
                      onClick={() => handleViewChange(item.appCode)}
                      style={{
                        // border: `2px solid ${item.color}`,
                        // boxShadow: `0 8px 20px ${item.color}55`,
                      }}
                    >
                      <Image
                        preview={false}
                        src={item.defaultImage}
                        alt={item.name}
                        className="app-image"
                      />

                      <div
                        className="app-name"
                        style={{ color: item.color }}
                      >
                        {item.name}
                      </div>
                    </div>
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

  return (
    <>
      {showA2HS && (
        <div className="a2hs-popup">
          <div className="popup-title">
            📱 เพิ่ม Web-app ไปหน้าจอหลัก
          </div>

          <div className="popup-text">
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
            className="cute-btn"
            onClick={() => {
              localStorage.setItem("a2hs-dismissed", "1");
              setShowA2HS(false);
            }}
          >
            เข้าใจแล้ว 💖
          </button>
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