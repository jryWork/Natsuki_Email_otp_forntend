import {
  Divider,
  Row,
  Table,
  Typography,
  Input,
  Col,
  Tooltip,
  message,
} from "antd";
import { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  startAt,
  endAt,
  get,
} from "firebase/database";
import moment from "moment";
import { appFirebase } from "./firebase";
import {
  CheckCircleFilled,
  WarningFilled,
  ExclamationCircleFilled,
  CopyOutlined,
} from "@ant-design/icons";
import EditButton from "./editButton";
import DeleteButton from "./deleteButton";
import AddButton from "./addButton";

const { Text } = Typography;
const PAGE_SIZE = 10;

const TextToolTip = ({ date, diffDay }) => (
  <Row>
    <Col span={12}>
      <Text style={{ color: "white", fontSize: 12, fontWeight: 700 }}>
        วันที่อัพเดท Pin ล่าสุด
      </Text>
    </Col>
    <Col span={12}>
      <Text style={{ color: "white", fontSize: 14 }}>
        {moment(date).format("DD/MM/YYYY")}
      </Text>
    </Col>
    <Col span={24}>
      <Text style={{ color: "white", fontSize: 12 }}>
        อัพเดทเมื่อ {diffDay} วันที่แล้ว
      </Text>
    </Col>
  </Row>
);

export default function EmailPin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // ───────────── Load Data ─────────────
  const loadData = async (keyword = "", pageNo = 1) => {
    setLoading(true);
    const db = getDatabase(appFirebase);

    let q;

    if (keyword) {
      const key = keyword.toLowerCase();
      q = query(
        ref(db, "emails"),
        orderByChild("emailLower"),
        startAt(key),
        endAt(key + "\uf8ff")
      );
    } else {
      q = query(ref(db, "emails"), orderByChild("createdAt"));
    }

    const snapshot = await get(q);

    if (snapshot.exists()) {
      const all = Object.entries(snapshot.val())
        .map(([id, value]) => ({ id, ...value }))
        .sort((a, b) => b.pinUpdatedAt - a.pinUpdatedAt);

      setTotal(all.length);

      const start = (pageNo - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      setUsers(all.slice(start, end));
    } else {
      setUsers([]);
      setTotal(0);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData("", 1);
  }, []);
  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    message.success("คัดลอกเรียบร้อย");
  };
  // ───────────── Columns ─────────────
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      render: (ts, record) => {
        return (
          <Text>
            {ts}{" "}
            <CopyOutlined
              onClick={() => {
                copy(ts);
              }}
              style={{ color: "#ABABAB", marginLeft: "8px" }}
            />
          </Text>
        );
      },
    },
    { title: "PIN", dataIndex: "pin", width: 50 },
    { title: "Option",
      dataIndex: "pinUpdatedAt",
      align: "center",
      width: 90,
      render: (ts, record) => {
        const diffDay = moment().diff(record.pinUpdatedAt, "days");

        return (
          <Row justify="center" style={{ columnGap: 8 }}>
            <Tooltip
              placement="top"
              title={<TextToolTip date={ts} diffDay={diffDay} />}
            >
              {diffDay < 7 ? (
                <CheckCircleFilled style={{ color: "#2adf00" }} />
              ) : diffDay < 14 ? (
                <WarningFilled style={{ color: "#f7aa10" }} />
              ) : (
                <ExclamationCircleFilled style={{ color: "#f44336" }} />
              )}
            </Tooltip>

            <EditButton
              baseData={record}
              onSuccess={() => loadData(search, page)}
            />
            <DeleteButton
              id={record.id}
              onSuccess={() => loadData(search, page)}
            />
          </Row>
        );
      },
    },
  ];

  return (
    <Row justify="center">
      <Col span={24} style={{ maxWidth: 1200 }}>
        <Row justify="space-between" align="middle">
          <Text style={{ fontSize: 24, fontWeight: 700 }}>รหัสยืนยันอีเมล</Text>
          <AddButton onSuccess={() => loadData(search, page)} />
        </Row>

        <Divider style={{ margin: "10px 0" }} />

        <Row style={{ marginBottom: 12 }} justify={"end"}>
          <Input.Search
            placeholder="ค้นหา email"
            allowClear
            onSearch={(value) => {
              setSearch(value);
              setPage(1); // 🔑 สำคัญ
              loadData(value, 1); // 🔑 สำคัญ
            }}
            style={{ maxWidth: "500px" }}
          />
        </Row>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            onChange: (p) => {
              setPage(p);
              loadData(search, p);
            },
          }}
        />
      </Col>
    </Row>
  );
}
