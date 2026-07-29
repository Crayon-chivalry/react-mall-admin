import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Flex,
  Button,
  App,
  type TableProps,
  type TablePaginationConfig,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import UserForm, { type UserFormRef } from "./components/UserForm";
import TableFiltering from "@/components/TableFiltering";
import PageHeader from "@/components/PageHeader";
import TableCard from "@/components/TableCard";
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

const filterList: FilterItem[] = [
  {
    label: "鎵嬫満鍙?",
    name: "phone",
    placeholder: "璇疯緭鍏ユ墜鏈哄彿",
    type: "input",
  },
  {
    label: "濮撳悕",
    name: "nickname",
    placeholder: "璇疯緭鍏ュ鍚?",
    type: "input",
  },
  {
    label: "鐘舵€?",
    name: "status",
    placeholder: "璇烽€夋嫨鐘舵€?",
    type: "select",
    options: [
      { label: "鍏ㄩ儴", value: 99 },
      { label: "姝ｅ父", value: 1 },
      { label: "鍐荤粨", value: 2 },
    ],
    defaultValue: 99,
  },
];

const statusList: Array<{ label: string; value: UserItem["status"]; color: string }> = [
  { label: "姝ｅ父", value: 1, color: "green" },
  { label: "鍐荤粨", value: 2, color: "warning" },
];

const renderStatusTag = createStatusTagRenderer<UserItem["status"]>(statusList);

const User = () => {
  const columns: TableProps<UserItem>["columns"] = [
    {
      title: "澶村儚",
      dataIndex: "avatar",
      key: "avatar",
      render: (_, { avatar }) => <Avatar src={avatar} size={40} />,
    },
    {
      title: "鎵嬫満鍙?",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "濮撳悕",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "鐘舵€?",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => renderStatusTag(status),
    },
    {
      title: "鎿嶄綔",
      dataIndex: "operate",
      key: "operate",
      render: (_, item) => <a onClick={() => handleShowForm(item)}>缂栬緫</a>,
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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSearch = (values: FormValues) => {
    const params: Partial<UserListParams> = {
      ...(values.phone ? { phone: Number(values.phone) } : {}),
      ...(values.nickname ? { nickname: String(values.nickname) } : {}),
      ...(values.status !== undefined && values.status !== "" && values.status !== 99
        ? { status: Number(values.status) }
        : {}),
    };

    setSearchParams(params);
    getList(1, pagination.pageSize, params);
  };

  const onSelectChange = async (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<UserItem> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleShowForm = (item?: UserItem) => {
    formRef.current?.showDrawer(item);
  };

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

  const onSuccess = () => {
    getList();
  };

  const handleDel = async () => {
    const { data: res } = await userApi.deletes(selectedRowKeys.map((key) => String(key)));
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
      <PageHeader title="鐢ㄦ埛鍒楄〃" des="鐢ㄦ埛淇℃伅鍒楄〃锛岀郴缁熶富瑕佹湇鍔″璞?">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => handleShowForm()}
        >
          鏂板
        </Button>
      </PageHeader>

      <TableFiltering filterList={filterList} onSubmit={onSearch} />

      <TableCard<UserItem>
        toolbar={
          <Flex align="center" gap="middle">
            <Button color="danger" variant="solid" icon={<DeleteOutlined />} onClick={handleDel}>
              鎵归噺鍒犻櫎
            </Button>
          </Flex>
        }
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

      <UserForm ref={formRef} onSuccess={onSuccess} />
    </div>
  );
};

export default User;
