import { useAuth } from "../component/useAuth";
import { useNavigate } from "react-router-dom";
import { Typography, Layout, Row, Image, Tabs } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "../component/firebase";
import { LogoutOutlined } from "@ant-design/icons";
import SubjectFilter from "../component/subjectFilter";

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { Text } = Typography;
  const { Header, Content } = Layout;
  if (loading) return null;
  if (!user) navigate("/login");

  const logout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  return (
    <Layout style={{ minHeight: "100dvh" }}>
      <Header
        style={{
          background: "white",
          padding: "0 16px", // ⭐ สำคัญ ตัด padding default ของ antd
        }}
      >
        <Row
          align="middle"
          style={{
            width: "100%",
          }}
        >
          {/* LOGO */}
          <div style={{ flex: 1 }}>
  <Image 
    preview={false} 
    width={50} 
    height={50} // กำหนดส่วนสูงให้เท่ากับความกว้าง
    src="/icon.png" 
    style={{ borderRadius: '50%', objectFit: 'cover' }} // ใส่ inline style ตรงนี้
  />
</div>

          {/* ADMIN */}
          <div>
            <Text strong>
              Admin{" "}
              <LogoutOutlined onClick={logout} style={{ cursor: "pointer" }} />
            </Text>
          </div>
        </Row>
      </Header>

      <Content style={{ padding: "16px" }}>
        <SubjectFilter />
      </Content>
    </Layout>
  );
}
