import { Image } from "antd";
import { useShop } from "../context/ShopContext";

const HeaderPage = ({ selectCard, codeApp }) => {
  const { shop, loading } = useShop();
  const shopCodeSetting = shop?.appSetting?.filter(
    (item) => item.appCode === codeApp,
  )[0];
  const AppShop = [
    {
      name: "NetFlix",
      appCode: "NF",
      shadowColor: "rgb(255 0 0 / 92%) 0px 1px 10px",
      defaultImage: "Netflix_icon.png",
    },
    {
      name: "Disney +",
      appCode: "DN",
      shadowColor: "rgb(67 192 234) 0px 1px 15px",
      defaultImage: "Disney_plus_icon.jpg",
    },
    {
      name: "TrueId",
      appCode: "TM",
      shadowColor: "rgb(255 0 0 / 92%) 0px 1px 10px",
      defaultImage: "trueid.webp",
    },
    {
      name: "GPT",
      appCode: "GPT",
      shadowColor: "rgb(20, 179, 139) 0px 1px 15px ",
      defaultImage: "gptIcon.jpg",
    },
    {
      name: "Prime",
      appCode: "PR",
      shadowColor: "rgb(60, 187, 230) 0px 1px 15px",
      defaultImage: "prime.webp",
    },
  ];

  const findApp = AppShop.find((item) => item.appCode === codeApp);
  return (
    <>
      <Image
        preview={false}
        style={{
          width: "80px",
          boxShadow: shopCodeSetting?.shadowColor
            ? `${shopCodeSetting?.shadowColor}  0px 1px 10px`
            : findApp?.shadowColor,
          borderRadius: codeApp === "NF" ? 8 : 16,
          margin: "10px 0px",
        }}
        src={
          shopCodeSetting?.logo?.url ? shopCodeSetting?.logo?.url : findApp?.defaultImage
        }
        alt={shopCodeSetting?.name ? shopCodeSetting?.name : findApp?.name}
      />
      <div className="hero" style={{ color: shop?.color || "white" }}>
        {selectCard ? null : (
          <>
            <span>
              {shop?.shopName || "Tomoru"} {findApp?.name} OTP
            </span>
            <span>กรอกอีเมล {findApp?.name} ที่ต้องการรับรหัสยืนยัน</span>
          </>
        )}
      </div>
    </>
  );
};

export default HeaderPage;
