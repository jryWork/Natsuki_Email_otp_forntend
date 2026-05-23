import { Button, Modal, Typography, Row } from "antd";
import { DeleteFilled, WarningFilled } from "@ant-design/icons";
import { useState } from "react";
import { getDatabase, ref, remove } from "firebase/database";
import { appFirebase } from "./firebase";

export default function DeleteSubject({ id, onSuccess }) {
  const [open, setOpen] = useState(false);
  const { Text } = Typography;
  const showModal = () => {
    setOpen(true);
  };
  const deleteEmails = async () => {
    const db = getDatabase(appFirebase);
    const newData = ref(db, "quarySubjects/" + id);
    await remove(newData).catch((err) => {
      console.log("err :", err);
    });
    onSuccess?.();
    setOpen(false);
  };

  return (
    <>
      <DeleteFilled onClick={showModal} style={{ color: "#CCCCCC" }} />
      <Modal open={open} footer={false} closeIcon={false}>
        <Text style={{fontSize: "16px"}}>
          <WarningFilled style={{ color: "#f7aa10" }} />{" "}
          ต้องการลบข้อมูลนี้หรือไม่?
        </Text>
        <Row justify={"space-between"} style={{marginTop: '16px'}}>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            style={{ width: "49%" }}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={() => {
              deleteEmails();
            }}
            style={{ width: "49%" }}
            type="primary"
          >
            ยืนยัน
          </Button>
        </Row>
      </Modal>
    </>
  );
}
