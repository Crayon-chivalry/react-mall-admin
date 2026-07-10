import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex, App, Popconfirm, Table, type TableProps } from "antd";
import {
  PlusOutlined,
  ProfileOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
} from "@ant-design/icons";

import RolesForm, { type RolesFormRef } from "./components/RolesForm";
import PermissionsForm, { type PermissionsFromRef } from "./components/PermissionsForm";
import styles from "./index.module.scss";
import { rbacApi } from "@/api/rbacApi";
import type { RolesItem } from "@/api/types";
import { createStatusTagRenderer } from "@/utils/status";

// 状态列表
const statusList: Array<{
  label: string;
  value: RolesItem["isEnabled"];
  color: string;
}> = [
  { label: "已启用", value: true, color: "green" },
  { label: "已禁用", value: false, color: "red" },
];

const renderStatusTag =
  createStatusTagRenderer<RolesItem["isEnabled"]>(statusList);

const Roles = () => {
  // 表单项
  const columns: TableProps<RolesItem>["columns"] = [
    {},
    {
      title: "角色名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "角色编码",
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
        <Flex gap="small">
          <Button
            color="primary"
            variant="text"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => handleShowPermissionsForm(item)}
          >
            权限
          </Button>
          <Button
            color="primary"
            variant="text"
            size="small"
            icon={<EditOutlined />}
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
            <Button
              color="danger"
              variant="text"
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  const navigate = useNavigate();
  const { message } = App.useApp();
  const formRef = useRef<RolesFormRef>(null);
  const permissionsFormRef = useRef<PermissionsFromRef>(null);
  const [rolesList, setRolesList] = useState<RolesItem[]>([]);

  // 显示表单抽屉
  const handleShowForm = (item?: RolesItem) => {
    formRef.current?.showDrawer(item);
  };

  const handleShowPermissionsForm = (item: RolesItem) => {
    permissionsFormRef.current?.showDrawer(item);
  };

  // 提交成功刷新数据
  const refreshData = () => {
    getRoles();
  };

  // 获取角色
  const getRoles = async () => {
    const { data: res } = await rbacApi.roles();
    setRolesList(res.data);
  };

  // 删除角色
  const handleDelete = async (id: number) => {
    const { data: res } = await rbacApi.deleteRole(id);
    message.success(res.message);
    getRoles();
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <div className={styles["column-gap"]}>
      <div className={styles["roles-panel"]}>
        <h2>权限管理</h2>
        <p>
          基于角色的访问控制 (RBAC)
          引擎。精准定义各级运营人员的菜单访问路径与操作动作权限。
        </p>
        <Flex gap="middle">
          <Button
            size="large"
            color="primary"
            variant="outlined"
            icon={<PlusOutlined />}
            onClick={() => handleShowForm()}
          >
            新增系统角色
          </Button>
          <Button
            size="large"
            variant="outlined"
            icon={<ProfileOutlined />}
            onClick={() => navigate("/logs")}
          >
            操作日志
          </Button>
        </Flex>
      </div>

      <div className={styles["table-card"]}>
        <Table<RolesItem>
          columns={columns}
          dataSource={rolesList}
          rowKey="id"
          pagination={false}
        />
      </div>

      {/* 角色表单 */}
      <RolesForm ref={formRef} onSuccess={refreshData} />
      {/* 分配权限 */}
      <PermissionsForm ref={permissionsFormRef} onSuccess={refreshData} />
    </div>
  );
};

export default Roles;
