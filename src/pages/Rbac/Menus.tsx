import { useEffect, useRef, useState } from 'react';
import { Button, App, Table, Flex, Popconfirm, type TableProps } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import PageHeader from '@/components/PageHeader'
import MenuIcon from '@/components/MenuIcon';
import MenusForm, { type MenusFormRef } from './components/MenusForm'
import styles from './index.module.scss'
import { rbacApi } from '@/api/rbacApi';
import type { MenuItem } from "@/api/types";
import { createStatusTagRenderer } from "@/utils/status";

// 类型列表
const statusList = [
  { label: "目录", value: 1, color: "green" },
  { label: "菜单", value: 2, color: "processing" },
  { label: "操作项", value: 3, color: "warning" }
];

const renderStatusTag = createStatusTagRenderer<MenuItem["type"]>(statusList);

const Menus = () => {
  // 表单项
  const columns: TableProps<MenuItem>["columns"] = [
    {},
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
      render: (_, { icon }) => <MenuIcon icon={icon} fallback={icon} />,
    },
    {
      title: "菜单名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "菜单编码",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "类型",
      dataIndex: "status",
      key: "status",
      render: (_, { type }) => renderStatusTag(type),
    },
    {
      title: "操作",
      dataIndex: "operate",
      key: "operate",
      render: (_, item) => (
        <Flex gap="large" className={styles["table-operate"]}>
          {item.type !== 3 && (
            <PlusOutlined onClick={() => handleAddChild(item)} />
          )}
          <EditOutlined onClick={() => handleShowForm(item)} />
          <Popconfirm
            title="提示"
            description="确定要删除吗?"
            onConfirm={() => handleDelete(item.id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: "#BA1A1A" }} />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  const { message } = App.useApp();
  const formRef = useRef<MenusFormRef>(null);
  const [menusList, setMenusList] = useState<MenuItem[]>([]);

  // 显示表单抽屉(新增、编辑)
  const handleShowForm = (item?: MenuItem) => {
    formRef.current?.showDrawer(item);
  };

  // 新增子菜单
  const handleAddChild = (item: MenuItem) => {
    formRef.current?.showDrawer(undefined, {
      type: item.type === 1 ? 2 : 3,
      parentId: item.id,
    });
  };

  // 提交成功刷新数据
  const onSuccess = () => {
    getMenus()
  }

  // 获取菜单树
  const getMenus = async () => {
    const { data: res } = await rbacApi.menus()
    setMenusList(res.data)
  }

  // 删除
  const handleDelete = async (id: number) => {
    const { data: res } = await rbacApi.deleteMenus(id);
    message.success(res.message);
    getMenus();
  }

  useEffect(() => {
    getMenus()
  }, [])

  return (
    <div className={styles["column-gap"]}>
      <PageHeader title='菜单管理' des='管理角色菜单权限，合理分配职务'>
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
        <Table<MenuItem>
          columns={columns}
          dataSource={menusList}
          rowKey="id"
        />
      </div>

      {/* 菜单表单 */}
      <MenusForm ref={formRef} menusList={menusList} onSuccess={onSuccess} />
    </div>
  )
}

export default Menus
