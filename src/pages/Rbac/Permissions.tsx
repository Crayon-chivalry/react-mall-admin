// 权限管理  弃用
import { useEffect, useRef, useState } from "react";
import { Button, App, Table, Flex, Popconfirm, type TableProps } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import PageHeader from '@/components/PageHeader'
import PermissionsForm, { type PermissionsFromRef } from './components/PermissionsForm'
import styles from './index.module.scss'
import type { PermissionItem } from '@/api/types'
import { rbacApi } from "@/api/rbacApi";
import { createStatusTagRenderer } from "@/utils/status";

// 状态列表
const statusList = [
  { label: "已启用", value: true, color: "processing" },
  { label: "已禁用", value: false, color: "warning" },
];

// 渲染标签
const renderStatusTag = createStatusTagRenderer<PermissionItem["isEnabled"]>(statusList);

const Permissions = () => {
  // 表单项
  const columns: TableProps<PermissionItem>["columns"] = [
    {
      title: "权限名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "权限编码",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (_, { isEnabled }) => renderStatusTag(isEnabled),
    },
    {
      title: "操作",
      dataIndex: "operate",
      key: "operate",
      render: (_, item) => (
        <Flex gap="large" className={styles["table-operate"]}>
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
  const [list, setList] = useState<PermissionItem[]>([]);
  const formRef = useRef<PermissionsFromRef>(null);

  // 显示表单抽屉
  const handleShowForm = (item?: PermissionItem) => {
    formRef.current?.showDrawer(item);
  };

  // 提交成功刷新数据
  const onSuccess = () => {
    getList()
  }
  
  // 获取权限列表
  const getList = async () => {
    const { data: res } = await rbacApi.permissions()
    setList(res.data)
  }

  // 删除权限
  const handleDelete = async (id: number) => {
    const { data: res } = await rbacApi.deletePermissions(id);
    message.success(res.message);
    getList();
  };

  useEffect(() => {
    getList()
  }, [])

  return (
    <div className={styles["column-gap"]}>
      <PageHeader title='权限管理' des='管理角色权限，合理分配职务'>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => handleShowForm()}
        >
          添加权限
        </Button>
      </PageHeader>

      <div className={styles["table-card"]}>
        <Table<PermissionItem>
          columns={columns}
          dataSource={list}
          rowKey="id"
        />
      </div>

      <PermissionsForm ref={formRef} onSuccess={onSuccess} />
    </div>
  )
}

export default Permissions