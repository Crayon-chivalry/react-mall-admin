import { useEffect, useRef, useState } from "react";
import {
  Table,
  Image,
  Flex,
  Button,
  Popconfirm,
  Divider,
  App,
  type TableProps,
  type TablePaginationConfig,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import PageHeader from "@/components/PageHeader";
import EntriesForm, { type EntriesFormRef } from "./components/EntriesForm";
import TableFiltering from "@/components/TableFiltering";
import styles from "./index.module.scss";
import {
  type Pagination,
  type EntriesItem,
  type EntriesListParams,
} from "@/api/types";
import {
  type FilterItem,
  type FormValues,
} from "@/components/TableFiltering/filterTypes";
import { contentApi } from "@/api/contentApi";
import { createStatusTagRenderer } from "@/utils/status";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

// 筛选配置
const filterList: FilterItem[] = [
  {
    label: "标题",
    name: "title",
    placeholder: "请输入标题",
    type: "input",
  },
  {
    label: "状态",
    name: "isEnabled",
    placeholder: "请选择状态",
    type: "select",
    options: [
      { label: "全部", value: "" },
      { label: "已启用", value: true },
      { label: "已禁用", value: false },
    ],
    defaultValue: "",
  },
];

// 状态列表
const statusList: Array<{
  label: string;
  value: EntriesItem["isEnabled"];
  color: string;
}> = [
  { label: "已启用", value: true, color: "green" },
  { label: "已禁用", value: false, color: "warning" },
];

const renderStatusTag =
  createStatusTagRenderer<EntriesItem["isEnabled"]>(statusList);

const Entries = () => {
  // 表单项
  const columns: TableProps<EntriesItem>["columns"] = [
    {
      title: "图标",
      dataIndex: "avatar",
      key: "avatar",
      render: (_, { iconUrl }) => <Image src={iconUrl} width={40} />,
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "跳转链接",
      dataIndex: "linkUrl",
      key: "linkUrl",
    },
    {
      title: "状态",
      dataIndex: "isEnabled",
      key: "isEnabled",
      render: (_, { isEnabled }) => renderStatusTag(isEnabled),
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
            onConfirm={() => handleDelete(item.id)}
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
  const formRef = useRef<EntriesFormRef>(null);
  const [list, setList] = useState<EntriesItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<Partial<EntriesListParams>>(
    {},
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 搜索
  const onSearch = (values: FormValues) => {
    const params: Partial<EntriesListParams> = {
      ...(values.title ? { title: String(values.title) } : {}),
      ...(typeof values.isEnabled === "boolean"
        ? { isEnabled: values.isEnabled }
        : {}),
    };
    setSearchParams(params);
    getList(1, pagination.pageSize, params);
  };

  // 分页发生变化
  const handleTableChange = (tablePagination: TablePaginationConfig) => {
    const nextPage = tablePagination.current ?? 1;
    const nextPageSize = tablePagination.pageSize ?? 10;
    getList(nextPage, nextPageSize);
  };

  // 表格行选中项发生变化
  const onSelectChange = async (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 表格行选择配置
  const rowSelection: TableRowSelection<EntriesItem> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 显示表单
  const handleShowForm = (item?: EntriesItem) => {
    formRef.current?.showDrawer(item);
  };

  // 添加 / 编辑 刷新数据
  const onSuccess = () => {
    getList();
  };

  // 获取列表
  const getList = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
    params: Partial<EntriesListParams> = searchParams,
  ) => {
    const { data: res } = await contentApi.entriesList({
      page,
      pageSize,
      ...params,
    });
    setList(res.data.list);
    setPagination(res.data.pagination);
  };

  // 删除
  const handleDelete = async (id?: number) => {
    const { data: res } = await contentApi.entriesDelete(
      id ? [id] : selectedRowKeys.map((key) => Number(key)),
    );
    setSelectedRowKeys([]);
    message.success(res.message);
    getList();
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className={styles["column-gap"]}>
      <PageHeader title="金刚区入口" des="C端首页金刚区，快捷入口列表">
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
          <Popconfirm
            title="提示"
            description="确定要删除吗?"
            onConfirm={() => handleDelete()}
            okText="Yes"
            cancelText="No"
          >
            <Button color="danger" variant="solid">
              批量删除
            </Button>
          </Popconfirm>
        </Flex>
        <Divider />
        <Table<EntriesItem>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={list}
          rowKey="id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onChange={handleTableChange}
        />
      </div>

      {/* 表单 */}
      <EntriesForm ref={formRef} onSuccess={onSuccess} />
    </div>
  );
};

export default Entries;
