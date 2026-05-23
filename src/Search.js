import { useState } from "react";
import _ from "lodash";
import {
  message,
  Spin,
  Modal,
  Row,
  Col,
  Image,
  Empty,
  Breadcrumb,
  Typography,
  Button,
} from "antd";
import {
  LoadingOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import CardLink from "./component/cardLink";
import Countdown, { zeroPad } from "react-countdown-now";
import moment from "moment";
import { HomeFilled } from "@ant-design/icons";
import HeaderPage from "./component/headerPage";
import FadeIn from "./component/fadeIn";
import CustomOtpInput from "./component/customOtpInput";

const SearchPage = ({ setCurrentView, appCode }) => {
  const currentHost = window.location.host;
  const { Text } = Typography;
  const [emailArray, setEmailArray] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searching, setSearching] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [countdown, setCountDown] = useState(Date.now() + 15000);
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState(15);
  const [selectCard, setSelectCard] = useState();
  const [verifyPin, setVerifyPin] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const searchMail = async () => {
    if (!keyword) {
      message.error("กรุณากรอกอีเมล");
      return;
    }
    setSearching(true);
    const uncodeEmail = await encodeURIComponent(keyword);

    const url = `https://getemails-qhcvr3fagq-uc.a.run.app/getEmails?senderEmail=${uncodeEmail}&appCode=${appCode}`;

    const mail = await axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => err);
    if (mail?.response?.data?.error) {
      const errorText = mail?.response?.data?.error;
      if (errorText === "Invalid sender email format.") {
        message.error("รูปแบบอีเมลไม่ถูกต้องกรุณาตรวจสอบอีเมลที่ท่านกรอก");
      } else if (
        errorText === "No valid emails found from this sender." ||
        errorText === "No emails found from this sender."
      ) {
        message.error(`ไม่มีอีเมลที่ได้รับจาก ${keyword}`);
      } else {
        message.error("ระบบผิดพลาดกรุณาลองใหม่อีกครั้ง");
      }
      setEmailArray([]);
      setSearching(false);
      return;
    }
    const loopEditData = await Promise.all(
      mail?.emails?.map((item) => {
        let html,
          intime = true;
        if (item.html) {
          const indexTable = item.html.indexOf("<table");
          if (indexTable !== -1) {
            html = item.html.slice(indexTable);
          }
        }
        if (!html) {
          return null;
        }
        if (item.date) {
          const add15min = moment(item.date, "DD/MM/YYYY HH:mm")
            .add(15, "minute")
            .add(7, "hour");
          const isBefore15min = moment(add15min).isAfter(moment(Date.now()));
          intime = isBefore15min;
        }
        return {
          ...item,
          html: html,
          intime: intime,
          date: moment(item.date, "DD/MM/YYYY HH:mm")
            .add(7, "hour")
            .format("DD/MM/YYYY HH:mm"),
        };
      }),
    );
    const compactMail = _.compact(loopEditData);
    if (!_.isEmpty(compactMail) && appCode === "DN") {
      const verify = await axios
        .post(`https://verifyemailpin-wfudlrftlq-uc.a.run.app/verifyemailpin`, {
          email: keyword,
        })
        .then((res) => res.data)
        .catch((err) => err);
      if (!verify?.success) {
        setVerifyPin(true);
      }
    }

    const finalData = _.orderBy(
      compactMail,
      (item) => {
        return moment(item.date, "DD/MM/YYYY HH:mm").toDate();
      },
      ["desc"],
    );
    if (_.isEmpty(finalData)) {
      setNotFound(true);
    }
    setEmailArray(finalData);
    setSearching(false);
  };
  const onChangeInput = (e) => {
    setKeyword(e.target.value);
  };
  const handleClick = () => {
    if (isCooldown) return; // Do nothing if button is in cooldown state

    // Start the cooldown process
    setIsCooldown(true);

    // Countdown logic: decrease the timer every second
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown); // Clear the interval once the timer reaches 0
          setIsCooldown(false); // Re-enable the button after 15 seconds
        }
        return prev - 1;
      });
    }, 1000); // Decrease every second
  };
  const changeOtp = async (e) => {
    if (e) {
      setVerifyLoading(true);
      const verify = await axios
        .post(`https://verifyemailpin-wfudlrftlq-uc.a.run.app/verifyemailpin`, {
          email: keyword,
          pin: e,
        })
        .then((res) => res.data)
        .catch((err) => err);
      if (verify?.success) {
        setVerifyPin(true);
      } else {
        message?.error("ข้อมูลไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
      }
      setVerifyLoading(false);
    }
  };

  if (appCode === "PR") {
    return (
      <Row
        style={{ width: "100%", marginTop: "40vh" }}
        justify={"center"}
        align={"middle"}
      >
        <Text style={{ color: "white", fontSize: "40px" }}>COMING SOON</Text>
        <Col span={24} style={{ textAlign: "center" }}>
          <Button
            onClick={() => {
              setCurrentView("landing");
            }}
          >
            กลับหน้าหลัก
          </Button>
        </Col>
      </Row>
    );
  }
  return (
    <>
      <div className="main hide-scrollbar">
        {selectCard ? null : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "16px 12px 0px 12px",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 900,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 20px",
              }}
            >
              {/* <img
                width={100}
                height={80}
                src={
                  "https://img.rdcw.co.th/images/72e07a0ede77c82ee26addc2720f81aba8a1f093a3f2eca4cc3c2cc392ab0525.png"
                }
                alt="Netflix"
                style={{ objectFit: "contain" }}
              /> */}
              {/* {currentHost === "Wonderland.fun" ? (
                <button
                  className="btn red-btn"
                  onClick={() => setOpen(true)}
                  style={{
                    background: "none",
                    border: "1px solid rgba(219, 16, 16, 1)",
                  }}
                >
                  วิธีใช้งาน
                </button>
              ) : null} */}
            </div>
            <Breadcrumb
              style={{
                marginTop: 8,
                color: "white",
              }}
              items={[
                {
                  title: (
                    <HomeFilled
                      onClick={() => setCurrentView("landing")}
                      style={{ color: "gray", cursor: "pointer" }}
                    />
                  ),
                },
                {
                  title: (
                    <Typography.Text style={{ color: "white" }}>
                      {appCode}
                    </Typography.Text>
                  ),
                },
              ]}
            />
          </div>
        )}

        <FadeIn key={selectCard}>
          {selectCard ? null : (
            <>
              <HeaderPage selectCard={selectCard} codeApp={appCode} />
              <div
                className="hero-buttons"
                justify={"space-between"}
                style={{ padding: "10px", marginTop: "4px" }}
              >
                <input
                  onChange={(e) => {
                    onChangeInput(e);
                  }}
                  style={{
                    borderRadius: "12px",
                    fontSize: "20px",
                    background: "none",
                    maxWidth: "437px",
                    color: "white",
                    borderColor: "white",
                  }}
                  type="text"
                  placeholder="Email Address"
                />
                <br />
                {isCooldown ? (
                  <button
                    disabled
                    className={
                      appCode === "NF" || appCode === "TM"
                        ? "btn red-btn"
                        : "btn blue-btn"
                    }
                    style={{
                      backgroundImage: "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      padding: `12px 30px`,
                      fontWeight: 500,
                      height: `60px`,
                      color: "white",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "20px",
                      border: "none",
                      boxShadow: `0px 3px 0px 0px ${
                        appCode === "NF" || appCode === "TM"
                          ? "rgb(106, 5, 5)"
                          : "rgb(23, 59, 109)"
                      }`,
                      backgroundColor:
                        appCode === "NF" || appCode === "TM"
                          ? "#b20000"
                          : "#15a0dc",
                    }}
                  >
                    <Countdown
                      date={countdown}
                      key={countdown}
                      renderer={({ seconds }) => {
                        return (
                          <span>
                            <Spin
                              spinning
                              indicator={
                                <LoadingOutlined style={{ color: "white" }} />
                              }
                            />{" "}
                            ลองใหม่ใน {zeroPad(seconds)} วินาที
                          </span>
                        );
                      }}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      searchMail();
                      handleClick();
                      setCountDown(Date.now() + 15000);
                      setTimer(15);
                      setVerifyPin(false);
                    }}
                    className={
                      appCode === "NF" || appCode === "TM"
                        ? "btn red-btn"
                        : "btn blue-btn"
                    }
                    style={{
                      backgroundImage: "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      padding: `12px 30px`,
                      fontWeight: 500,
                      height: `60px`,
                      color: "white",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "20px",
                      border: "none",
                      boxShadow: `0px 3px 0px 0px ${
                        appCode === "NF" || appCode === "TM"
                          ? "rgb(106, 5, 5)"
                          : "rgb(23, 59, 109)"
                      }`,
                      backgroundColor:
                        appCode === "NF" || appCode === "TM"
                          ? "#b20000"
                          : "#15a0dc",
                    }}
                  >
                    <SearchOutlined /> ค้นหาอีเมล
                  </button>
                )}
              </div>
            </>
          )}
          <Row
            style={{ width: "100%", padding: "0 10px", marginBottom: "6px" }}
          >
            {searching ? (
              <Col span={24}>
                <Spin
                  spinning
                  style={{ marginTop: "12vh" }}
                  indicator={<LoadingOutlined style={{ fontSize: "50px" }} />}
                />
              </Col>
            ) : _.isEmpty(emailArray) ? (
              <Col span={24}>
                <Empty style={{ marginTop: "60px" }} description={false}>
                  {" "}
                  <p>ไม่พบอีเมล</p>
                </Empty>
              </Col>
            ) : !_.isEmpty(emailArray) && !verifyPin && appCode === "DN" ? (
              <Col span={24}>
                <Row>
                  <Col span={24} style={{ marginBottom: "16px" }}>
                    <Text style={{ color: "white" }}>
                      ตรวจพบข้อความ ใส่เลข 4 หลัก ของการสั่งซื้อเพื่อดูข้อความ
                    </Text>
                  </Col>
                  <Col span={24} style={{ marginBottom: "16px" }}>
                    <Row justify="center">
                      <CustomOtpInput
                        length={4}
                        onChange={(e) => {
                          changeOtp(e);
                        }}
                        disabled={verifyLoading}
                      />
                      {verifyLoading ? (
                        <Spin
                          spinning
                          style={{ marginLeft: "16px" }}
                          indicator={
                            <LoadingOutlined style={{ color: "white" }} />
                          }
                        />
                      ) : null}
                    </Row>
                  </Col>
                </Row>
              </Col>
            ) : (
              <Col span={24} style={{ textAlign: "center" }}>
                {emailArray?.map((item, index) => {
                  return (
                    <CardLink
                      item={item}
                      setSelectCard={setSelectCard}
                      index={index}
                      selectCard={selectCard}
                      setVerifyPin={setVerifyPin}
                      setEmailArray={setEmailArray}
                      appCode={appCode}
                    />
                  );
                })}
              </Col>
            )}
          </Row>
          {/* <div
            style={{
              width: "100%",
              textAlign: "center",
              position: "fixed",
            }}
          >
            <strong>
              <p style={{ color: "#878787", fontSize: "10px" }}>
                ©Wonderland Official 2026
              </p>
            </strong>
          </div> */}
        </FadeIn>
      </div>
      <Modal
        title="วิธีการใช้งาน"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        footer={false}
      >
        <Row>
          <Col span={24}>
            <Image
              style={{ width: "100%" }}
              src={"/howto.jpg"}
              alt={"how to "}
            />
          </Col>
        </Row>
        <button
          onClick={() => {
            setOpen(false);
          }}
          className="btn"
          style={{
            background: "rgb(229, 9, 20)",
            height: "50px",
            fontSize: "20px",
            width: "100%",
            marginTop: "16px",
          }}
        >
          เข้าใจแล้ว
        </button>
      </Modal>
      <Modal
        open={notFound}
        closeIcon={false}
        footer={false}
        style={{
          marginTop: "10vh",
        }}
      >
        <Row>
          <Col span={24} style={{ textAlign: "center" }}>
            <ExclamationCircleFilled
              style={{ color: "#f44336", fontSize: 80 }}
            />
          </Col>
          <Col span={24} style={{ textAlign: "center", marginTop: "16px" }}>
            <Text style={{ fontSize: 18, fontWeight: 700 }}>
              ไม่พบข้อมูลอีเมล
            </Text>
          </Col>
        </Row>
        <button
          onClick={() => {
            setNotFound(false);
          }}
          className="btn"
          style={{
            background: "rgb(229, 9, 20)",
            height: "50px",
            fontSize: "20px",
            width: "100%",
            marginTop: "16px",
          }}
        >
          ปิด
        </button>
      </Modal>
    </>
  );
};

export default SearchPage;
