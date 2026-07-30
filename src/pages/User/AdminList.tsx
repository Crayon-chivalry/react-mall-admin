import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Flex,
  Button,
  Popconfirm,
  Tag,
  App,
  type TableProps,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import AssignRolesForm, {
  type AssignRolesRef,
} from "./components/AssignRolesForm";
import UserForm, { type UserFormRef } from "./components/UserForm";
import PageHeader from "@/components/PageHeader";
import TableCard from "@/components/TableCard";
import useTablePagination from "@/components/TableCard/useTablePagination";
import useTableSelection from "@/components/TableCard/useTableSelection";
import { userApi } from "@/api/userApi";
import { type Pagination, type UserItem } from "@/api/types";

const User = () => {
  // 配置项
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
          {adminRoles.map((item) => (
            <Tag color="red" key={item.id}>
              {item.name}
            </Tag>
          ))}
        </Flex>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "正常" : "冻结"}
        </Tag>
      ),
    },
    {
      title: "操作",
      dataIndex: "operate",
      key: "operate",
      render: (_, item) => (
        <Flex gap="small">
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
            <Button color="danger" variant="text" size="small">
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
  const {
    selectedRowKeys,
    rowSelection,
    clearSelectedRowKeys,
  } = useTableSelection<UserItem>();

  // 显示角色表单
  const handleShowForm = (item?: UserItem) => {
    formRef.current?.showDrawer(item, "admin");
  };

  // 显示分配角色表单
  const handleShowAssignRoles = (item: UserItem) => {
    assignRolesRef.current?.showDrawer(item);
  };

  // 获取数据
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

  // 删除
  const handleDel = async (id?: string) => {
    const { data: res } = await userApi.deletes(
      id ? [String(id)] : selectedRowKeys.map((key) => String(key)),
    );
    clearSelectedRowKeys();
    message.success(res.message);
    getList();
  };

  // 分页变化获取数据
  const { handleTableChange } = useTablePagination(getList);

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="column-gap">
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

      <TableCard<UserItem>
        toolbar={
          <Flex align="center" gap="middle">
            <Popconfirm
              title="提示"
              description="确定要删除吗?"
              onConfirm={() => handleDel()}
              okText="Yes"
              cancelText="No"
            >
              <Button color="danger" variant="solid" icon={<DeleteOutlined />}>
                批量删除
              </Button>
            </Popconfirm>
          </Flex>
        }
        rowSelection={rowSelection}
        columns={columns}
        dataSource={list}
        rowKey="userId"
        pagination={pagination}
        onChange={handleTableChange}
      />

      <UserForm ref={formRef} onSuccess={() => getList()} />
      <AssignRolesForm ref={assignRolesRef} onSuccess={() => getList()} />
    </div>
  );
};

export default User;
