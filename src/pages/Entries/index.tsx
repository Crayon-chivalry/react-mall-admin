import { useEffect, useRef, useState } from "react";
import {
  Image,
  Flex,
  Button,
  Popconfirm,
  App,
  type TableProps,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import { contentApi } from "@/api/contentApi";
import { defineStatusOptions, createStatusTagRenderer } from "@/utils/status";
import {
  type Pagination,
  type EntriesItem,
  type EntriesListParams,
} from "@/api/types";
import PageHeader from "@/components/PageHeader";
// 筛选相关
import TableFiltering from "@/components/TableFiltering";
import {
  type FilterItem,
  type FormValues,
} from "@/components/TableFiltering/filterTypes";
// 表格相关
import TableCard from "@/components/TableCard";
import useTablePagination from "@/components/TableCard/useTablePagination";
import useTableSelection from "@/components/TableCard/useTableSelection";
// 表单
import EntriesForm, { type EntriesFormRef } from "./components/EntriesForm";

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
const statusList = defineStatusOptions<EntriesItem["isEnabled"]>([
  { label: "已启用", value: true, color: "green" },
  { label: "已禁用", value: false, color: "red" },
])
const renderStatusTag = createStatusTagRenderer(statusList);

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
      title: "排序",
      dataIndex: "sort",
      key: "sort",
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
            onConfirm={() => handleDel(item.id)}
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
  const { selectedRowKeys, rowSelection, clearSelectedRowKeys } =
    useTableSelection<EntriesItem>();

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

  // 显示表单
  const handleShowForm = (item?: EntriesItem) => {
    formRef.current?.showDrawer(item);
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
  const handleDel = async (id?: number) => {
    const { data: res } = await contentApi.entriesDelete(
      id ? [id] : selectedRowKeys.map((key) => Number(key)),
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
      <PageHeader title="金刚区入口" des="首页金刚区，快捷入口列表">
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

      <TableCard<EntriesItem>
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
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />

      {/* 表单 */}
      <EntriesForm ref={formRef} onSuccess={() => getList()} />
    </div>
  );
};

export default Entries;
