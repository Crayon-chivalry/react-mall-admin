import { useEffect, useRef, useState } from "react";
import {
  Table,
  Avatar,
  Flex,
  Button,
  Divider,
  App,
  type TableProps,
  type TablePaginationConfig,
} from "antd";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import UserForm, { type UserFormRef } from "./components/UserForm";
import TableFiltering from "@/components/TableFiltering";
import PageHeader from "@/components/PageHeader";
import {
  type FilterItem,
  type FormValues,
} from "@/components/TableFiltering/filterTypes";
import styles from "./index.module.scss";
import { userApi } from "@/api/userApi";
import { type Pagination, type UserItem, type UserListParams } from "@/api/types";
import { createStatusTagRenderer } from "@/utils/status";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

// 筛选配置
const filterList: FilterItem[] = [
  {
    label: "手机号",
    name: "phone",
    placeholder: "请输入手机号",
    type: "input",
  },
  {
    label: "姓名",
    name: "nickname",
    placeholder: "请输入姓名",
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
const statusList: Array<{ label: string; value: UserItem["status"]; color: string }> = [
  { label: "正常", value: 1, color: "green" },
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

  const { message } = App.useApp();
  const formRef = useRef<UserFormRef>(null)
  const [list, setList] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<Partial<UserListParams>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 搜索
  const onSearch = (values: FormValues) => {
    const params: Partial<UserListParams> = {
      ...(values.phone ? { phone: Number(values.phone) } : {}),
      ...(values.nickname ? { nickname: String(values.nickname) } : {}),
      ...(values.status !== undefined && values.status !== '' && values.status !== 99
        ? { status: Number(values.status) }
        : {}),
    };

    setSearchParams(params);
    getList(1, pagination.pageSize, params);
  };

  // 表格行选中项发生变化
  const onSelectChange = async (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 表格行选择配置
  const rowSelection: TableRowSelection<UserItem> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 显示表单
  const handleShowForm = (item?: UserItem) => {
    formRef.current?.showDrawer(item)
  }

  // 获取用户列表
  const getList = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
    params: Partial<UserListParams> = searchParams,
  ) => {
    const { data: res } = await userApi.list({
      page,
      pageSize,
      ...params,
      role: "customer"
    });
    setList(res.data.list);
    setPagination(res.data.pagination);
  };

  // 添加 / 修改成功 重新获取数据
  const onSuccess = () => {
    getList()
  };

  // 批量删除
  const handleDel = async () => {
    const { data: res } = await userApi.deletes(selectedRowKeys.map(key => String(key)))
    message.success(res.message);
    getList()
  }

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

      <div className={styles["table-card"]}>
        <Flex align="center" gap="middle">
          <Button color="danger" variant="solid" icon={<DeleteOutlined />} onClick={handleDel}>
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
      <UserForm ref={formRef} onSuccess={onSuccess} />
    </div>
  );
};

export default User;
