import { Button, Form, Modal, Input, Row, Divider, Typography } from "antd";
import { EditFilled } from "@ant-design/icons";
import { useState } from "react";
import {
  getDatabase,
  ref,
  set,
  serverTimestamp,
} from "firebase/database";
import { appFirebase } from "./firebase";
import CustomOtpInput from "./customOtpInput";

export default function EditButton({ baseData, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const {Text} = Typography;
  const showModal = () => {
    setOpen(true);
  };
  const editEmails = async (value) => {
    const db = getDatabase(appFirebase);
    const newData = ref(db, "emails/" + baseData?.id);
    const samePin = value.pin === baseData.pin;
    set(newData, {
      email: value.email,
      emailLower: value.email.toLowerCase(),
      pin: value.pin,
      createdAt: baseData?.createdAt,
      updatedAt: serverTimestamp(),
      pinUpdatedAt: samePin ? baseData?.pinUpdatedAt : serverTimestamp(),
    }).catch((err) => {
      console.log("err :", err);
    });
    onSuccess?.();
    form?.resetFields();
    setOpen(false);
  };

  return (
    <>
      <EditFilled onClick={showModal} style={{color: '#CCCCCC'}} />
      <Modal width={400} open={open} footer={false} closeIcon={false}>
        <Text style={{ fontSize: 18, fontWeight: 700 }}>แก้ไขข้อมูล</Text>
        <Divider style={{ margin: "10px 0px" }} />
        <Form
          form={form}
          layout="vertical"
          initialValues={baseData}
          onFinish={editEmails}
        >
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
