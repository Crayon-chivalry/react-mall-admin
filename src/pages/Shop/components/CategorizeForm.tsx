import { forwardRef, useImperativeHandle, useState } from "react";
import { Drawer, Form, Input, InputNumber, Button, Switch, Select, App } from "antd";

import UploadImages from "@/components/UploadImages";
import { categoriesApi } from "@/api/categoriesApi";
import type { CategoriesItem } from "@/api/types";

export interface CategorizeRef {
  showDrawer: (item?: CategoriesItem, parentId?: number) => void;
}

type SliderFormProps = {
  onSuccess?: (item?: CategoriesItem) => void;
};

// 表单验证规则
const rules = {
  name: [{ required: true, message: "请输入名称" }],
  icon: [{ required: true, message: "请上传图片" }],
};

const SliderForm = forwardRef<CategorizeRef, SliderFormProps>((props, ref) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<CategoriesItem>();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([{label: "顶级分类", value: 0}])
  const [editingItem, setEditingItem] = useState<CategoriesItem | null>(null);
  const { onSuccess } = props;

  // 打开抽屉
  const showDrawer = async (item?: CategoriesItem, parentId?: number) => {
    await getParentList();
    setEditingItem(item ?? null);
    if (item) {
      form.setFieldsValue({ ...item });
    } else {
      form.resetFields();
      form.setFieldsValue({ sort: 1, isVisible: true, parentId: parentId || 0 });
    }
    setOpen(true);
  };

  // 关闭抽屉
  const onClose = () => {
    setOpen(false);
  };

  // 获取一级分类
  const getParentList = async () => {
    const { data: res } = await categoriesApi.parentList()
    const newOptions = res.data.map((item: CategoriesItem) => {
      return {label: item.name, value: item.id}
    })
    setOptions([{label: "顶级分类", value: 0}, ...newOptions])
  }

  // 提交
  const onFinish = async (values: CategoriesItem) => {
    const { data: res } = editingItem
      ? await categoriesApi.update(editingItem.id, values)
      : await categoriesApi.add(values);
    message.success(res.message);
    onSuccess?.(res.data);
    onClose();
  };

  useImperativeHandle(ref, () => ({
    showDrawer,
  }));

  return (
    <Drawer
      title={editingItem ? "编辑分类" : "添加分类"}
      onClose={onClose}
      open={open}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item<CategoriesItem> label="分类类型" name="parentId">
          <Select options={options} />
        </Form.Item>
        <Form.Item<CategoriesItem>
          label="图片"
          name="icon"
          rules={rules.icon}
        >
          <UploadImages
            initialUrls={editingItem?.icon ? [editingItem.icon] : []}
            onUploadSuccess={(urls) => {
              form.setFieldsValue({ icon: urls[0] });
            }}
          />
        </Form.Item>
        <Form.Item<CategoriesItem> label="分类名称" name="name" rules={rules.name}>
          <Input size="large" placeholder="请输入名称" />
        </Form.Item>
        <Form.Item<CategoriesItem> label="排序权重" name="sort">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item<CategoriesItem> label="启用" name="isVisible" valuePropName="checked">
          <Switch />
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

export default SliderForm;
