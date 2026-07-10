import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Drawer, App, Tree, type TreeProps, type TreeDataNode } from "antd";

import type { RolesItem, MenuItem } from "@/api/types";
import { rbacApi } from "@/api/rbacApi";

export interface PermissionsFromRef {
  showDrawer: (item: RolesItem) => void;
}

type PermissionsFormProps = {
  onSuccess?: () => void;
};

const PermissionsForm = forwardRef<PermissionsFromRef, PermissionsFormProps>(
  (props, ref) => {
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [menusList, setMenusList] = useState<TreeDataNode[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
    const [rolesId, setRolesId] = useState(0);

    // 打开抽屉
    const showDrawer = async (item: RolesItem) => {
      setRolesId(item.id);
      setCheckedKeys(item.menus.map((menu: MenuItem) => menu.id));
      setOpen(true);
    };

    // 关闭抽屉
    const onClose = () => {
      setCheckedKeys([]);
      setOpen(false);
    };

    // 勾选权限
    const onCheck: TreeProps['onCheck'] = async (checkedKeys) => {
      setCheckedKeys(checkedKeys as number[]);
      const { data: res } = await rbacApi.updateRoleMenus(rolesId, checkedKeys as number[]);
      message.success(res.message);
      props.onSuccess?.();
    }

    // 获取菜单树
    const getMenus = async () => {
      const { data: res } = await rbacApi.menus();
      setMenusList(res.data);
    };

    useEffect(() => {
      getMenus();
    }, []);

    useImperativeHandle(ref, () => ({
      showDrawer,
    }));

    return (
      <Drawer title="分配权限" onClose={onClose} open={open}>
        <Tree
          checkable
          defaultExpandAll
          fieldNames={{ title: "name", key: "id" }}
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          treeData={menusList}
        />
      </Drawer>
    );
  },
);

export default PermissionsForm;
