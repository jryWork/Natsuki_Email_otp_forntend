import { Button, Modal, Typography, Row } from "antd";
import { DeleteFilled, WarningFilled } from "@ant-design/icons";
import { useState } from "react";
import { getDatabase, ref, remove, runTransaction } from "firebase/database";
import { appFirebase } from "./firebase";

export default function DeleteButton({ id, onSuccess }) {
  const [open, setOpen] = useState(false);
  const { Text } = Typography;
  const showModal = () => {
    setOpen(true);
  };
  const deleteEmails = async (value) => {
    const db = getDatabase(appFirebase);
    const newData = ref(db, "emails/" + id);
    await remove(newData).catch((err) => {
      console.log("err :", err);
    });
    const totalRef = ref(db, "emails_meta/total");
    await runTransaction(totalRef, (current) => {
      return (current || 0) - 1;
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
