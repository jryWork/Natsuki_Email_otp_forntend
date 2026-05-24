import { useState } from "react";
import { Form, Input, Button, Card, message, Image } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../component/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../component/useAuth";

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [loadingFunc, setLoading] = useState(false);

  if (loading) return null;
  if (user) navigate("/assmin");

  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await userCredential.user.getIdToken();
      message.success("Login สำเร็จ");
      navigate("/assmin");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        message.error("รหัสผ่านไม่ถูกต้อง");
      } else if (err.code === "auth/user-not-found") {
        message.error("ไม่พบผู้ใช้นี้");
      } else {
        message.error("Login ไม่สำเร็จ");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    height: "50px",
    borderRadius: "10px",
    fontSize: "16px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Card
          title="เข้าสู่ระบบ Admin"
          style={{ width: 360, borderRadius: "25px" }}
        >

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "กรุณากรอก email" },
                { type: "email", message: "รูปแบบ email ไม่ถูกต้อง" },
              ]}
            >
              <Input
                style={inputStyle}
                placeholder="admin@email.com"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
            >
              <Input.Password
                style={inputStyle}
                placeholder="••••••••"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loadingFunc}
              block
              style={{
                backgroundColor: "rgb(3 104 211)",
                borderRadius: "15px",
                height: "50px",
                fontWeight: "600",
                boxShadow: "0px 5px 0px 0px rgb(3 68 144)",
              }}
            >
              เข้าสู่ระบบ
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
