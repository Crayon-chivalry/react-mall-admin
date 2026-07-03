import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Flex, Row, Popconfirm, Tree, App, type TreeProps } from "antd";
import { PlusOutlined, ProfileOutlined } from "@ant-design/icons";

import RolesForm, { type RolesFormRef } from "./components/RolesForm";
import styles from "./index.module.scss";
import { rbacApi } from "@/api/rbacApi";
import type { RolesItem, MenusItem } from "@/api/types";

const Roles = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const formRef = useRef<RolesFormRef>(null);
  const [rolesList, setRolesList] = useState<RolesItem[]>([]);
  const [menusList, setMenusList] = useState<MenusItem[]>([]);
  const [menuIds, setMenuIds] = useState<number[]>([]);

  // 显示表单抽屉
  const handleShowForm = (item?: RolesItem) => {
    formRef.current?.showDrawer(item);
  };

  const onCheck: TreeProps["onCheck"] = (selectedKeys) => {
    setMenuIds(selectedKeys as number[])
  }

  // 提交成功刷新数据
  const onSuccess = () => {
    getRoles();
  };

  // 获取角色
  const getRoles = async () => {
    const { data: res } = await rbacApi.roles();
    console.log("角色", res);
    setRolesList(res.data);
    getMenus();
  };

  // 获取菜单树
  const getMenus = async () => {
    const { data: res } = await rbacApi.menus();
    setMenusList(res.data);
    console.log(res.data);
  };

  // 删除角色
  const handleDelete = async (id: number) => {
    const { data: res } = await rbacApi.deleteRole(id);
    message.success(res.message);
    getRoles();
  };

  // 更新角色菜单
  const updateRoleMenus = async () => {
    console.log("更新角色菜单", menuIds);
    const { data: res } = await rbacApi.updateRoleMenus(4, menuIds);
    message.success(res.message);
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

      <Row gutter={24}>
        {/* 角色列表 */}
        <Col className="gutter-row" span={8}>
          <div className={styles["roles-list"]}>
            {rolesList.map((item) => (
              <div className={styles["app-card"]} key={item.id}>
                <div className={styles["roles-name"]}>{item.name}</div>
                <div className={styles["roles-des"]}>{item.description}</div>
                <Flex justify="flex-end">
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
              </div>
            ))}
          </div>
        </Col>
        {/* 权限配置 */}
        <Col className="gutter-row" span={16}>
          <div className={styles["app-card"]}>
            <div className={styles["permission-top"]}>
              <div>
                <div>权限配置：超级管理员</div>
                <div>设置角色可访问的菜单项及其内部的具体操作按钮权限</div>
              </div>
              <div>
                <Button>重置修改</Button>
                <Button onClick={updateRoleMenus}>保存配置</Button>
              </div>
            </div>
            {menusList.length > 0 && (
              <Tree
                checkable
                defaultExpandAll
                fieldNames={{ title: "name", key: "id" }}
                treeData={menusList}
                onCheck={onCheck}
              />
            )}
          </div>
        </Col>
      </Row>

      {/* 角色表单 */}
      <RolesForm ref={formRef} onSuccess={onSuccess} />
    </div>
  );
};

export default Roles;
