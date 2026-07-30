import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Flex,
  Button,
  Tag,
  Popconfirm,
  App,
  type TableProps,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { userApi } from "@/api/userApi";
import {
  type Pagination,
  type UserItem,
  type UserListParams,
} from "@/api/types";
import {
  type FilterItem,
  type FormValues,
} from "@/components/TableFiltering/filterTypes";
import UserForm, { type UserFormRef } from "./components/UserForm";
import TableFiltering from "@/components/TableFiltering";
import PageHeader from "@/components/PageHeader";
import TableCard from "@/components/TableCard";
import useTablePagination from "@/components/TableCard/useTablePagination";
import useTableSelection from "@/components/TableCard/useTableSelection";

const filterList: FilterItem[] = [
  {
    label: "手机号",
    name: "phone",
    placeholder: "请输入手机号",
    type: "input",
  },
  {
    label: "昵称",
    name: "nickname",
    placeholder: "请输入昵称",
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

const User = () => {
  const columns: TableProps<UserItem>["columns"] = [
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      render: (_, { avatar }) => <Avatar src={avatar} size={40} />,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "昵称",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={status ? "green" : "red"}>{status ? "正常" : "冻结"}</Tag>
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
  const [list, setList] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<Partial<UserListParams>>({});
  const { selectedRowKeys, rowSelection, clearSelectedRowKeys } =
    useTableSelection<UserItem>();

  // 搜索
  const onSearch = (values: FormValues) => {
    const params: Partial<UserListParams> = {
      ...(values.phone ? { phone: Number(values.phone) } : {}),
      ...(values.nickname ? { nickname: String(values.nickname) } : {}),
      ...(values.status !== undefined &&
      values.status !== "" &&
      values.status !== 99
        ? { status: Number(values.status) }
        : {}),
    };
    setSearchParams(params);
    getList(1, pagination.pageSize, params);
  };

  // 显示表单
  const handleShowForm = (item?: UserItem) => {
    formRef.current?.showDrawer(item);
  };

  // 获取数据
  const getList = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
    params: Partial<UserListParams> = searchParams,
  ) => {
    const { data: res } = await userApi.list({
      page,
      pageSize,
      ...params,
      role: "customer",
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
      <PageHeader title="用户列表" des="用户信息列表，系统主要服务对象">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => handleShowForm()}
        >
          新增
        </Button>
      </PageHeader>

      <TableFiltering filterList={filterList} onSubmit={onSearch} />

      <TableCard<UserItem>
        toolbar={
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
        }
        rowSelection={rowSelection}
        columns={columns}
        dataSource={list}
        rowKey="userId"
        pagination={pagination}
        onChange={handleTableChange}
      />

      {/* 表单 */}
      <UserForm ref={formRef} onSuccess={() => getList()} />
    </div>
  );
};

export default User;
