import { useState } from "react";
import { Modal, Checkbox, Row, Col, Alert, Input, Flex, App } from "antd";

import { systemApi } from "@/api/systemApi";

interface ClearDataModalProps {
  open: boolean;
  onClose: () => void;
}

const items = [
  { label: "用户列表", value: "user" },
  { label: "商品列表", value: "products" },
  { label: "订单列表", value: "orders" },
  { label: "操作日志", value: "logs" },
  { label: "内容模块", value: "contents" },
];

const ClearDataModal = ({ open, onClose }: ClearDataModalProps) => {
  const { message } = App.useApp();
  const [clearItems, setClearItems] = useState<Record<string, boolean> | null>(
    null,
  );
  const [confirmMsg, setConfirmMsg] = useState("");
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  const onChange = (checkedValue: string[]) => {
    const selected = Object.fromEntries(checkedValue.map((key) => [key, true]));
    setClearItems(selected);
    setCheckedValues(checkedValue);
  };

  const handleClose = () => {
    setClearItems(null);
    setCheckedValues([]);
    setConfirmMsg("");
    onClose?.();
  };

  // 确认重置
  const handleConfirm = async () => {
    if (!clearItems || Object.keys(clearItems).length === 0) {
      message.warning("请选择要清空的数据");
      return;
    }
    if (confirmMsg !== "确认清空数据") {
      message.warning("请输入'确认清空数据'");
      return;
    }
    const { data: res } = await systemApi.reset(clearItems);
    message.success(res.message);
    handleClose();
  };

  return (
    <Modal title="清空数据" open={open} onOk={handleConfirm} onCancel={handleClose}>
      <Flex gap="middle" vertical>
        <Alert
          title="请选择要清空的数据，并在输入框输入确认信息，请谨慎操作！"
          type="warning"
          showIcon
        />
        <Checkbox.Group
          style={{ width: "100%" }}
          value={checkedValues}
          onChange={onChange}
        >
          <Row gutter={[8, 8]}>
            {items.map((item) => (
              <Col span={12} key={item.value}>
                <Checkbox value={item.value}>{item.label}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
        <Input
          value={confirmMsg}
          placeholder="请输入'确认清空数据'"
          onChange={(e) => setConfirmMsg(e.target.value)}
        />
      </Flex>
    </Modal>
  );
};

export default ClearDataModal;
