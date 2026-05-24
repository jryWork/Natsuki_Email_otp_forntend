import {
  Button,
  Form,
  Modal,
  Input,
  Typography,
  Divider,
  Row,
  Select,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { getDatabase, ref, set, serverTimestamp } from "firebase/database";
import { appFirebase } from "./firebase";
import _ from "lodash";

export default function AddButton({ baseData, onSuccess }) {
  const { Text } = Typography;
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
    form?.setFieldsValue({
      subjects: [{ subject: "", type: "" }],
    });
  };
  const addSubjectFunc = async (value) => {
    const db = getDatabase(appFirebase);
    const newData = ref(db, "quarySubjects/" + baseData?.id);
    const subjects = !_.isEmpty(baseData?.subjects) ? baseData?.subjects : [];
    set(newData, {
      ...baseData,
      subjects: _.concat(subjects, value?.subjects),
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
      <PlusOutlined onClick={showModal} style={{ color: "#CCCCCC" }} />

      <Modal width={400} open={open} footer={false} closeIcon={false}>
        <Text style={{ fontSize: 18, fontWeight: 700 }}>เพิ่มชื่อเรื่อง</Text>
        <Divider style={{ margin: "10px 0px" }} />
        <Form form={form} layout="vertical" onFinish={addSubjectFunc}>
          <Form.List name="subjects">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <>
                    ชื่อเรื่อง(Subject) {index + 1}
                    <Row
                      style={{ width: "100%" }}
                      justify={"space-between"}
                      align={"middle"}
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, "type"]}
                        key={field.key}
                        rules={[
                          { required: true, message: "กรุณาเลือกรูปแบบ" },
                        ]}
                        style={{ marginBottom: 10 }}
                      >
                        <Select
                          style={{ width: "100px" }}
                          allowClear
                          options={[
                            { label: "to", value: "to" },
                            { label: "from", value: "from" },
                          ]}
                        />
                      </Form.Item>
                      {index > 0 && (
                        <MinusCircleOutlined
                          onClick={() => {
                            remove(index);
                          }}
                        />
                      )}
                    </Row>
                    <Row justify={"space-between"}>
                      <Form.Item
                        {...field}
                        name={[field.name, "subject"]}
                        key={field.key}
                        rules={[
                          { required: true, message: "กรุณากรอก ชื่อเรื่อง" },
                        ]}
                        style={{ marginBottom: 10 }}
                      >
                        <Input />
                      </Form.Item>
                    </Row>
                  </>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    style={{ width: "100%" }}
                  >
                    เพิ่มชื่อเรื่อง
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
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
