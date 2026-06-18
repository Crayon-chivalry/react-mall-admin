import { useEffect, useRef, useState } from "react";
import { Statistic, Table, Avatar, type TableProps, Tag } from "antd";

import UserForm, { type UserFormRef } from "./components/UserForm";
import TableFiltering from "@/components/TableFiltering";
import {
  type FilterItem,
  type FormValues,
} from "@/components/TableFiltering/filterTypes";
import styles from "./index.module.scss";
import { userApi } from "@/api/userApi";
import { type UserItem } from "@/api/types"

// 筛选配置
const filterList: FilterItem[] = [
  {
    label: "用户名",
    name: "userid",
    placeholder: "请输入用户名",
    type: "input",
  },
  {
    label: "姓名",
    name: "nickname",
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
    defaultValue: 99,
  },
];

// 状态列表
const statusList = [
  { label: "正常", value: 1, color: "processing" },
  { label: "冻结", value: 2, color: "warning" },
];

// 渲染状态标签
function renderStatusTag(status: UserItem["status"]) {
  const item = statusList.find((i) => i.value === status);
  const color = item?.color ?? "default";
  const label = item?.label ?? "未知";
  return <Tag color={color}>{label}</Tag>;
}

const User = () => {
  // 表单项
  const columns: TableProps<UserItem>["columns"] = [
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      render: (_, {avatar}) => <Avatar src={avatar} size={40} />,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "姓名",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => renderStatusTag(status),
    },
    {
      title: "操作",
      dataIndex: "operate",
      key: "operate",
      render: (_, item) => <a onClick={() => handleShowForm(item)}>编辑</a>,
    },
  ];

  const formRef = useRef<UserFormRef>(null);
  const [list, setList] = useState([]);

  const onSearch = (values: FormValues) => {
    console.log(values);
  };

  // 显示编辑表单
  const handleShowForm = (item: UserItem) => {
    formRef.current?.showDrawer(item)
  };

  // 获取用户列表
  const getList = async () => {
    const { data: res } = await userApi.list({ page: 1, pageSize: 10 });
    setList(res.data.list);
  };

  useEffect(() => {
    getList();
  }, []);

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
        <Table<UserItem> columns={columns} dataSource={list} rowKey="id" />
      </div>

      {/* 用户编辑 */}
      <UserForm ref={formRef} />
    </div>
  );
};

export default User;
