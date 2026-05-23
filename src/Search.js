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
        message.error("รูปแบบอีเมลไม่ถูกต้อง");
      } else {
        message.error("ไม่พบข้อมูลอีเมล");
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

        if (!html) return null;

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
      })
    );

    const compactMail = _.compact(loopEditData);

    const finalData = _.orderBy(
      compactMail,
      (item) => {
        return moment(item.date, "DD/MM/YYYY HH:mm").toDate();
      },
      ["desc"]
    );

    if (_.isEmpty(finalData)) {
      setNotFound(true);
    }

    setEmailArray(finalData);
    setSearching(false);
  };

  const handleClick = () => {
    if (isCooldown) return;

    setIsCooldown(true);

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setIsCooldown(false);
        }

        return prev - 1;
      });
    }, 1000);
  };

  return (
    <>
      <div className="search-container" style={{marginTop:"45px"}}>
        {!selectCard && (
          <>
            <FadeIn>
              <div className="search-header">
                <div>
                  <h1>ค้นหาอีเมล 6 หลัก 💌</h1>
                  <p>กรอกอีเมลเพื่อค้นหาข้อความล่าสุด</p>
                </div>

                <Breadcrumb
                  items={[
                    {
                      title: (
                        <HomeFilled
                          onClick={() => setCurrentView("landing")}
                          style={{
                            color: "#db2982",
                            cursor: "pointer",
                          }}
                        />
                      ),
                    },
                    {
                      title: (
                        <Typography.Text style={{ color: "#555" }}>
                          {appCode}
                        </Typography.Text>
                      ),
                    },
                  ]}
                />
              </div>

              <div className="search-box">
                <input
                  type="text"
                  placeholder="Email Address"
                  onChange={(e) => setKeyword(e.target.value)}
                />

                {isCooldown ? (
                  <button className="search-btn disabled-btn" disabled>
                    <Countdown
                      date={countdown}
                      key={countdown}
                      renderer={({ seconds }) => {
                        return (
                          <span>
                            <Spin
                              spinning
                              indicator={
                                <LoadingOutlined
                                  style={{ color: "white" }}
                                />
                              }
                            />
                            {" "}รอ {zeroPad(seconds)} วิ
                          </span>
                        );
                      }}
                    />
                  </button>
                ) : (
                  <button
                    className="search-btn"
                    onClick={() => {
                      searchMail();
                      handleClick();
                      setCountDown(Date.now() + 15000);
                      setTimer(15);
                    }}
                  >
                    <SearchOutlined /> ค้นหาอีเมล
                  </button>
                )}
              </div>
            </FadeIn>
          </>
        )}

        <Row style={{ width: "100%", marginTop: 20 }}>
          {searching ? (
            <Col span={24} style={{ textAlign: "center", marginTop: "15vh" }}>
              <Spin
                spinning
                indicator={<LoadingOutlined style={{ fontSize: 50 }} />}
              />
            </Col>
          ) : _.isEmpty(emailArray) ? (
         <div></div>
          ) : (
            <Col span={24}>
              {emailArray?.map((item, index) => {
                return (
                  <CardLink
                    key={index}
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
      </div>

      <Modal
        open={notFound}
        closeIcon={false}
        footer={false}
        centered
      >
        <Row>
          <Col span={24} style={{ textAlign: "center" }}>
            <ExclamationCircleFilled
              style={{ color: "#ff4d88", fontSize: 80 }}
            />
          </Col>

          <Col span={24} style={{ textAlign: "center", marginTop: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 700 }}>
              ไม่พบข้อมูลอีเมล
            </Text>
          </Col>
        </Row>

        <button
          onClick={() => setNotFound(false)}
          className="cute-btn"
          style={{ width: "100%", marginTop: 20 }}
        >
          ปิด
        </button>
      </Modal>
    </>
  );
};

export default SearchPage;