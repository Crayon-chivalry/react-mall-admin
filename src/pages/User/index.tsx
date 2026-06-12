import { Statistic, Table, type TableProps, Tag } from "antd";

import TableFiltering from '@/components/TableFiltering'
import { type FilterItem, type FormValues } from "@/components/TableFiltering/filterTypes";
import styles from "./index.module.scss";

interface DataType {
  key: string;
  userid: string;
  name: string;
  avatar: string;
  phone: string;
  status: 1 | 2;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "头像",
    dataIndex: "avatar",
    key: "avatar",
    render: () => (
      <img src='/src/assets/images/tx.png' width={40} />
    )
  },
  {
    title: "用户名",
    dataIndex: "userid",
    key: "userid",
  },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "手机号",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (_, { status }) => (
      renderStatusTag(status)
    )
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: () => (
      <a>编辑</a>
    )
  }
];

// 数据
const data: DataType[] = [
  {
    key: '1',
    userid: 'admin',
    name: '胡彦斌',
    avatar: "tx.png",
    phone: "14152526363",
    status: 1
  },
  {
    key: '2',
    userid: '123',
    name: '123',
    avatar: "tx.png",
    phone: "16152526363",
    status: 2
  }
]

// 筛选配置
const filterList: FilterItem[] = [
  {
    label: "用户名",
    name: "userid",
    placeholder: "请输入用户名",
    type: "input"
  },
  {
    label: "姓名",
    name: "name",
    placeholder: "请输入姓名",
    type: "input",
  },
  {
    label: "手机号",
    name: "phone",
    placeholder: "请输入手机号",
    type: "input",
  },
  {
    label: "状态",
    name: "status",
    placeholder: "请选择状态",
    type: "select",
    options: [
      { label: "全部", value: 99 },
      { label: "正常", value: 1 },
      { label: "冻结", value: 2 },
    ],
    defaultValue: 99
  }
]

// 状态列表
const statusList = [
  { label: '正常', value: 1, color: 'processing' },
  { label: '冻结', value: 2, color: 'warning' }
]

// 渲染状态标签
function renderStatusTag(status: DataType["status"]) {
  const item = statusList.find(i => i.value === status);
  const color = item?.color ?? 'default';
  const label = item?.label ?? '未知';
  return <Tag color={color}>{label}</Tag>;
}

const User = () => {
  const onSearch = (values: FormValues) => {
    console.log(values)
  }

  return (
    <div className={styles["column-gap"]}>
      <div className={styles["top"]}>
        <div>
          <div className={styles["top-title"]}>用户管理</div>
          <div className={styles["top-label"]}>
            精细化管理系统权限与用户账户信息
          </div>
        </div>
        <div className={styles["total"]}>
          <div className={styles["total-label"]}>活跃用户总数</div>
          <Statistic
            value={112893}
            valueStyle={{ color: "#fff", fontSize: "48px", lineHeight: "48px" }}
          />
        </div>
      </div>

      <TableFiltering filterList={filterList} onSubmit={onSearch} />

      <div className={styles["table-card"]}>
        <Table<DataType> columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default User;
