import { useEffect, useRef, useState } from "react";
import {
  Table,
  Avatar,
  Flex,
  Button,
  Divider,
  Popconfirm,
  Tag,
  App,
  type TableProps,
  type TablePaginationConfig,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import AssignRolesForm, {
  type AssignRolesRef,
} from "./components/AssignRolesForm";
import UserForm, { type UserFormRef } from "./components/UserForm";
import PageHeader from "@/components/PageHeader";
import styles from "./index.module.scss";
import { userApi } from "@/api/userApi";
import { type Pagination, type UserItem } from "@/api/types";
import { createStatusTagRenderer } from "@/utils/status";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

// 状态列表
const statusList: Array<{
  label: string;
  value: UserItem["status"];
  color: string;
}> = [
  { label: "正常", value: 1, color: "processing" },
  { label: "冻结", value: 2, color: "warning" },
];

const renderStatusTag = createStatusTagRenderer<UserItem["status"]>(statusList);

const User = () => {
  // 表单项
  const columns: TableProps<UserItem>["columns"] = [
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      render: (_, { avatar }) => <Avatar src={avatar} size={40} />,
    },
    {
      title: "账号",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "姓名",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "角色",
      dataIndex: "status",
      key: "status",
      render: (_, { adminRoles }) => (
        <Flex wrap gap="small">
          {adminRoles.map(item => 
            <Tag color="red" key={item.id}>{ item.name }</Tag>
          )}
        </Flex>
      ),
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
      render: (_, item) => (
        <Flex gap="small" className={styles["table-operate"]}>
          <Button
            color="primary"
            variant="text"
            size="small"
            onClick={() => handleShowAssignRoles(item)}
          >
            分配角色
          </Button>
          <Button
            color="primary"
            variant="text"
            size="small"
            onClick={() => handleShowForm(item)}
          >
            编辑
          </Button>
          <Popconfirm
            title="提示"
            description="确定要删除吗?"
            onConfirm={() => handleDel(item.userId)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              color="danger"
              variant="text"
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  const { message } = App.useApp();
  const formRef = useRef<UserFormRef>(null);
  const assignRolesRef = useRef<AssignRolesRef>(null);
  const [list, setList] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 表格行选中项发生变化
  const onSelectChange = async (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 表格行选择配置
  const rowSelection: TableRowSelection<UserItem> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 显示添加表单
  const handleShowForm = (item?: UserItem) => {
    formRef.current?.showDrawer(item, "admin");
  };

  // 显示分配角色表单
  const handleShowAssignRoles = (item?: UserItem) => {
    assignRolesRef.current?.showDrawer(item);
  };

  // 获取用户列表
  const getList = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
  ) => {
    const { data: res } = await userApi.list({
      page,
      pageSize,
      role: "admin",
    });
    setList(res.data.list);
    setPagination(res.data.pagination);
  };

  // 添加 / 修改成功 重新获取数据
  const refreshData = () => {
    getList();
  };

  // 删除
  const handleDel = async (id?: string) => {
    const { data: res } = await userApi.deletes(
      id ? [String(id)] :
      selectedRowKeys.map((key) => String(key))
    );
    message.success(res.message);
    getList();
  };

  useEffect(() => {
    getList();
  }, []);

  const handleTableChange = (tablePagination: TablePaginationConfig) => {
    const nextPage = tablePagination.current ?? 1;
    const nextPageSize = tablePagination.pageSize ?? 10;
    getList(nextPage, nextPageSize);
  };

  return (
    <div className={styles["column-gap"]}>
      <PageHeader title="管理员列表" des="系统管理员，运营维护系统">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => handleShowForm()}
        >
          新增
        </Button>
      </PageHeader>

      <div className={styles["table-card"]}>
        <Flex align="center" gap="middle">
          <Button
            color="danger"
            variant="solid"
            icon={<DeleteOutlined />}
            onClick={() => handleDel()}
          >
            批量删除
          </Button>
        </Flex>
        <Divider />
        <Table<UserItem>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={list}
          rowKey="userId"
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onChange={handleTableChange}
        />
      </div>

      {/* 用户表单 */}
      <UserForm ref={formRef} onSuccess={refreshData} />
      <AssignRolesForm ref={assignRolesRef} onSuccess={refreshData} />
    </div>
  );
};

export default User;
