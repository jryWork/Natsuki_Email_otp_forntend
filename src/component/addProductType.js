import { Button, Form, Modal, Input, Typography, Divider, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  getDatabase,
  ref,
  set,
  push,
  serverTimestamp,
} from "firebase/database";
import { appFirebase } from "./firebase";

export default function AddProduct({ onSuccess }) {
  const { Text } = Typography;
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const createApp = async (value) => {
    const db = getDatabase(appFirebase);
    const newData = push(ref(db, "quarySubjects"));
    set(newData, {
      appName: value.name,
      appCode: value.appCode,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch((err) => {
      console.log("err :", err);
    });
    onSuccess?.();
    form?.resetFields();
    setOpen(false);
  };
  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        เพิ่ม App
      </Button>
      <Modal width={400} open={open} footer={false} closeIcon={false}>
        <Text style={{ fontSize: 18, fontWeight: 700 }}> เพิ่ม App</Text>
        <Divider style={{ margin: "10px 0px" }} />
        <Form form={form} layout="vertical" onFinish={createApp}>
          <Form.Item
            label={"ชื่อแอป"}
            name={"name"}
            rules={[{ required: true, message: "กรุณากรอก ชื่อแอป" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={"Code"}
            name={"appCode"}
            rules={[{ required: true, message: "กรุณากรอก appCode" }]}
          >
            <Input />
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
