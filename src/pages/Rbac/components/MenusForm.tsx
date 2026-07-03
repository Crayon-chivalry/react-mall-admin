import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Radio,
  InputNumber,
  TreeSelect,
  App,
} from "antd";

import type { MenusItem } from "@/api/types";
import { rbacApi } from "@/api/rbacApi";

export interface MenusFormRef {
  showDrawer: (item?: MenusItem, defaultValues?: Partial<MenusItem>) => void;
}

type MenusFormProps = {
  menusList?: MenusItem[];
  onSuccess?: (item?: MenusItem) => void;
};

type MenuTreeItem = MenusItem & {
  children?: MenuTreeItem[];
};

// 表单验证规则
const rules = {
  name: [{ required: true, message: "请输入菜单名称" }],
  code: [{ required: true, message: "请输入菜单编码" }],
  type: [{ required: true, message: "请选择类型" }],
  icon: [{ required: true, message: "请输入图标名称" }],
  parentId: [{ required: true, message: "请输入父级菜单ID" }],
  permissionCode: [{ required: true, message: "请输入权限编码" }],
  path: [{ required: true, message: "请输入路由路径" }],
  component: [{ required: true, message: "请输入组件路径" }],
};

// 过滤掉操作类型的菜单，并递归处理子菜单
const filterMenusTree = (list: MenusItem[] = []): MenuTreeItem[] => {
  return (list as MenuTreeItem[])
    .filter((item) => item.type !== 3)
    .map((item) => ({
      ...item,
      children: item.children ? filterMenusTree(item.children) : undefined,
    }));
};

const MenusForm = forwardRef<MenusFormRef, MenusFormProps>((props, ref) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<MenusItem>();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenusItem | null>(null);
  const { onSuccess } = props;
  const currentType = Form.useWatch("type", form);
  const parentMenusTree = filterMenusTree(props.menusList);

  // 打开抽屉
  const showDrawer = async (
    item?: MenusItem,
    defaultValues?: Partial<MenusItem>,
  ) => {
    setEditingItem(defaultValues ? null : (item ?? null));
    if (item && !defaultValues) {
      form.setFieldsValue({ ...item });
    } else {
      form.resetFields();
      form.setFieldsValue({
        type: 1,
        sort: 1,
        ...defaultValues,
      });
    }
    setOpen(true);
  };

  // 关闭抽屉
  const onClose = () => {
    setOpen(false);
  };

  // 提交
  const onFinish = async (values: MenusItem) => {
    const { data: res } = editingItem
      ? await rbacApi.updateMenus(editingItem.id, values)
      : await rbacApi.addMenus(values);
    message.success(res.message);
    onSuccess?.(res.data);
    onClose();
  };

  useImperativeHandle(ref, () => ({
    showDrawer,
  }));

  return (
    <Drawer
      title={editingItem ? "编辑菜单" : "添加菜单"}
      onClose={onClose}
      open={open}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item<MenusItem> label="菜单类型" name="type" rules={rules.type}>
          <Radio.Group
            options={[
              { value: 1, label: "目录" },
              { value: 2, label: "菜单" },
              { value: 3, label: "操作项" },
            ]}
          />
        </Form.Item>
        <Form.Item<MenusItem> label="菜单名称" name="name" rules={rules.name}>
          <Input size="large" placeholder="请输入菜单名称" />
        </Form.Item>
        <Form.Item<MenusItem> label="菜单编码" name="code" rules={rules.code}>
          <Input size="large" placeholder="请输入菜单编码" />
        </Form.Item>
        {/* 类型目录才需要图标 */}
        {currentType === 1 && (
          <Form.Item<MenusItem> label="图标" name="icon" rules={rules.icon}>
            <Input size="large" placeholder="请输入图标名称" />
          </Form.Item>
        )}
        {/* 类型除目录都需要设置父级菜单和权限 */}
        {currentType !== 1 && (
          <Form.Item<MenusItem>
            label="父级菜单"
            name="parentId"
            rules={rules.parentId}
          >
            <TreeSelect
              placeholder="请选择父级菜单"
              fieldNames={{ label: "name", value: "id" }}
              treeData={parentMenusTree}
            />
          </Form.Item>
        )}
        {/* 类型菜单需要设置路由和组件 */}
        {currentType == 2 && (
          <>
            <Form.Item<MenusItem>
              label="路由路径"
              name="path"
              rules={rules.path}
            >
              <Input size="large" placeholder="请输入路由路径" />
            </Form.Item>
            <Form.Item<MenusItem>
              label="组件路径"
              name="component"
              rules={rules.component}
            >
              <Input size="large" placeholder="请输入组件路径" />
            </Form.Item>
          </>
        )}
        {/* 类型操作项需要设置权限编码 */}
        {currentType === 3 && (
          <Form.Item<MenusItem>
            label="权限编码"
            name="permissionCode"
            rules={rules.permissionCode}
          >
            <Input size="large" placeholder="请输入权限编码" />
          </Form.Item>
        )}
        <Form.Item<MenusItem> label="排序权重" name="sort">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block size="large" htmlType="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export default MenusForm;
