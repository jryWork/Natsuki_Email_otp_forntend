import { Divider, Row, Table, Typography, Input, Col } from "antd";
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
import { appFirebase } from "./firebase";
import EditSubject from "./editSubject";
import AddProduct from "./addProductType";
import AddSubject from "./addSubject";
import DeleteSubject from "./deleteSubject";
import ShowSubject from "./showSubject";

const { Text } = Typography;
const PAGE_SIZE = 10;

export default function SubjectFilter() {
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
      q = query(
        ref(db, "quarySubjects"),
        orderByChild("appName"),
        startAt(keyword),
        endAt(keyword + "\uf8ff"),
      );
    } else {
      q = query(ref(db, "quarySubjects"), orderByChild("createdAt"));
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

  const columns = [
    {
      title: "Name",
      dataIndex: "appName",
    },
    {
      title: "Option",
      dataIndex: "pinUpdatedAt",
      align: "center",
      width: 120,
      render: (ts, record) => {
        return (
          <Row justify="center" style={{ columnGap: 8 }}>
            <ShowSubject baseData={record} />
            <AddSubject baseData={record} onSuccess={() => loadData(search, page)}/>
            <EditSubject
              baseData={record}
               onSuccess={() => loadData(search, page)}
            />
            <DeleteSubject
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
          <Text style={{ fontSize: 24, fontWeight: 700 }}>
            ชื่อเรื่อง Email
          </Text>
          <AddProduct onSuccess={() => loadData(search, page)} />
        </Row>

        <Divider style={{ margin: "10px 0" }} />

        <Row style={{ marginBottom: 12 }} justify={"end"}>
          <Input.Search
            placeholder="ค้นหา name"
            allowClear
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
              loadData(value, 1);
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
