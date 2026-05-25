import { Row, Col, Typography, Badge } from "antd";
import {
  CaretRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import FadeIn from "./fadeIn";

const CardLink = ({
  item,
  setSelectCard,
  index,
  selectCard,
  appCode,
  setVerifyPin,
}) => {
  const AppShop = [
    {
      name: "NetFlix",
      appCode: "NF",
      defaultImage: "Netflix_icon.png",
    },
    {
      name: "DisneyPlus",
      appCode: "DN",
      defaultImage: "Disney_plus_icon.jpg",
    },
    {
      name: "TrueId",
      appCode: "TM",
      defaultImage: "trueid.webp",
    },
    {
      name: "GPT",
      appCode: "GPT",
      defaultImage: "gptIcon.jpg",
    },
    {
      name: "Prime",
      appCode: "PR",
      defaultImage: "prime.webp",
    },
  ];

  const defualtApp = AppShop.find(
    (item) => item.appCode === appCode
  );

  if (selectCard && selectCard !== index + 1) {
    return null;
  }

  if (selectCard && selectCard === index + 1) {
    const fixedHtml = item.html
      .replace(/width:\s*560px/g, "width:100%;max-width:80vw")
      .replace(/width="560"/g, 'width="100%"');

    return (
      <FadeIn>
        <div className="mail-detail">
          <Typography.Paragraph
            className="back-btn"
            onClick={() => {
              setSelectCard(null);
              setVerifyPin(false);
            }}
          >
            <ArrowLeftOutlined /> ย้อนกลับ
          </Typography.Paragraph>

          <div className="mail-content">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  appCode === "GPT"
                    ? fixedHtml?.replaceAll(/[\x00-\x1F\x7F]/g, "")
                    : `${item.html?.replaceAll(
                        /[\x00-\x1F\x7F]/g,
                        ""
                      )}`,
              }}
            />
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <Badge.Ribbon
      text={item?.intime ? "พร้อมใช้" : "หมดอายุ"}
      color={item?.intime ? "#00cd74" : "red"}
    >
      <div
        className="mail-card"
        onClick={() => {
          setSelectCard(index + 1);
        }}
      >
        <Row align="middle">
          <Col xs={4}>
            <img
              src={defualtApp?.defaultImage}
              alt={defualtApp?.name}
              className="mail-app-icon"
            />
          </Col>

          <Col xs={17}>
            <Typography.Paragraph className="mail-date">
              {item?.date} น.
            </Typography.Paragraph>

            <Typography.Paragraph
              className="mail-subject"
              ellipsis
            >
              {item?.subject}
            </Typography.Paragraph>
          </Col>

          <Col xs={3} style={{ textAlign: "right" }}>
            <CaretRightOutlined className="mail-arrow" />
          </Col>
        </Row>
      </div>
    </Badge.Ribbon>
  );
};

export default CardLink;