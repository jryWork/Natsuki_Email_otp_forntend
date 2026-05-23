import { Button, Form, Modal, Input, Typography, Divider, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  getDatabase,
  ref,
  set,
  push,
  serverTimestamp,
  runTransaction,
} from "firebase/database";
import { appFirebase } from "./firebase";
import CustomOtpInput from "./customOtpInput";


export default function AddButton({ onSuccess }) {
  const { Text } = Typography;
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const createEmails = async (value) => {
    const db = getDatabase(appFirebase);
    const newData = push(ref(db, "emails"));
    set(newData, {
      email: value.email,
      emailLower: value.email.toLowerCase(),
      pin: value.pin,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      pinUpdatedAt: serverTimestamp(),
    }).catch((err) => {
      console.log("err :", err);
    });
    const totalRef = ref(db, "emails_meta/total");
    await runTransaction(totalRef, (current) => {
      return (current || 0) + 1;
    });
    onSuccess?.();
    form?.resetFields();
    setOpen(false);
  };
  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        เพิ่มรายการ
      </Button>
      <Modal width={400} open={open} footer={false} closeIcon={false}>
        <Text style={{ fontSize: 18, fontWeight: 700 }}>เพิ่มรายการ</Text>
        <Divider style={{ margin: "10px 0px" }} />
        <Form form={form} layout="vertical" onFinish={createEmails}>
          <Form.Item
            label={"Email"}
            name={"email"}
            rules={[
              { required: true, message: "กรุณากรอก Email" },
              { type: "email", message: "กรุณากรอก Email" },
            ]}
          >
            <Input placeholder="xxxx@gmail.com" />
          </Form.Item>
          <Form.Item
            label={"Pin"}
            name={"pin"}
            rules={[{ required: true, message: "กรุณากรอก Pin" }]}
          >
            <CustomOtpInput length={4} />
          </Form.Item>
          <Row justify={"space-between"}>
            <Button
              onClick={() => {
                setOpen(false);
                form?.resetFields();
              }}
              style={{ width: "49%" }}
            >
              ยกเลิก
            </Button>
            <Button style={{ width: "49%" }} htmlType="submit" type="primary">
              บันทึก
            </Button>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
