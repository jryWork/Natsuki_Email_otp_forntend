import { Row, Col, Typography, Badge } from "antd";
import { CaretRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import FadeIn from "./fadeIn";
const CardLink = ({
  item,
  setSelectCard,
  index,
  selectCard,
  appCode,
  setVerifyPin,
  setEmailArray,
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

  const defualtApp = AppShop.find((item) => item.appCode === appCode);

  if (selectCard && selectCard !== index + 1) {
    return null;
  } else if (selectCard && selectCard === index + 1) {
    const fixedHtml = item.html
      .replace(/width:\s*560px/g, "width:100%;max-width:80vw")
      .replace(/width="560"/g, 'width="100%"');
    return (
      <FadeIn>
        <Row style={{ width: "100%", marginTop: "10px" }} justify={"center"}>
          <Col span={24} style={{ textAlign: "start", marginBottom: "10px" }}>
            <Typography.Paragraph
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: "24px",
                marginBottom: 0,
              }}
              onClick={() => {
                setSelectCard(null);
                setVerifyPin(false);
                setEmailArray([]);
              }}
            >
              <ArrowLeftOutlined style={{ fontSize: "24px" }} /> ย้อนกลับ
            </Typography.Paragraph>
          </Col>
          <Col
            span={24}
            className="tableCol"
            style={{
              background: "white",
              maxWidth: "500px",
              borderRadius: "8px",
              justifySelf: "center",
            }}
          >
            <div
              style={{ width: "100%" }}
              dangerouslySetInnerHTML={{
                __html:
                  appCode === "GPT"
                    ? fixedHtml?.replaceAll(/[\x00-\x1F\x7F]/g, "")
                    : `${item.html?.replaceAll(/[\x00-\x1F\x7F]/g, "")}`,
              }}
            />
          </Col>
        </Row>
      </FadeIn>
    );
  }
  return (
    <Badge.Ribbon
      text={item?.intime ? "พร้อมใช้งาน" : "หมดอายุ"}
      style={{ marginLeft: "6px" }}
      color={item?.intime ? "green" : "red"}
    >
      <div
        style={{
          position: "relative",

          maxHeight: "70px",

          overflow: "hidden",
          boxSizing: "border-box",
          width: "100%",
          maxWidth: 700,
          marginBottom: "10px",

          display: "flex",

          flexDirection: "column",

          gap: "5px",

          padding: "10px",

          background: "white",

          borderRadius: 15,

          boxShadow: `0px 3px 0px 0px ${"rgb(188, 188, 188)"}`,

          justifySelf: "center",
        }}
        onClick={() => {
          setSelectCard(index + 1);
        }}
      >
        {/* content */}
        <div
          style={{
            position: "relative",

            zIndex: 1,
          }}
        >
          <Row>
            <Col
              xs={3}
              md={3}
              style={{
                textAlign: "center",

                justifyContent: "center",

                height: "100%",

                padding: "4px 15px 0px 0px",
              }}
            >
              <img
                src={defualtApp?.defaultImage}
                alt={defualtApp?.name}
                width={"38"}
                height={"38"}
                style={{
                  borderRadius: "6px",
                  objectFit: "cover",
                }}
              />
            </Col>

            <Col xs={18} md={19}>
              <Typography.Paragraph
                style={{
                  textAlign: "start",

                  marginBottom: 0,

                  fontWeight: 700,

                  color: "black",
                }}
              >
                {item?.date} น.
              </Typography.Paragraph>

              <Typography.Paragraph
                style={{
                  textAlign: "start",

                  fontWeight: 700,

                  color: "#515151",

                  marginBottom: 0,
                }}
                ellipsis
              >
                {item?.subject}
              </Typography.Paragraph>
            </Col>

            <Col xs={2} md={2}>
              <CaretRightOutlined
                style={{
                  paddingTop: "22px",
                }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Badge.Ribbon>
  );
};

export default CardLink;
