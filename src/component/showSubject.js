import {
  Button,
  Form,
  Modal,
  Input,
  Typography,
  Divider,
  Row,
  Select,
  Col,
} from "antd";
import { EyeOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { getDatabase, ref, set, serverTimestamp } from "firebase/database";
import { appFirebase } from "./firebase";
import _ from "lodash";

export default function ShowSubject({ baseData }) {
  const { Text } = Typography;
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  return (
    <>
      <EyeOutlined onClick={showModal} style={{ color: "#CCCCCC" }} />

      <Modal width={400} open={open} footer={false} closeIcon={false}>
        <Text style={{ fontSize: 18, fontWeight: 700 }}>รายการชื่อเรื่อง</Text>
        <Divider style={{ margin: "10px 0px" }} />
        <Row>
          {baseData?.subjects?.map((item, index) => {
            return (
              <Col span={24}>
                <Row wrap>
                  <Col span={24}>{index + 1}. {item?.type}:email</Col>
                  <Col flex={"none"} style={{paddingLeft: "16px"}}>
                    <Typography.Text>
                       subject:{item?.subject}
                    </Typography.Text>
                  </Col>
                </Row>
              </Col>
            );
          })}
        </Row>
        <Button onClick={()=>{setOpen(false)}} type="primary" style={{width: "100%",marginTop: '20px'}}>ปิด</Button>
      </Modal>
    </>
  );
}
