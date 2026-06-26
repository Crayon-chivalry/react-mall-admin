// 未解决 label 会被遮住的问题

import { Button, Form, Input, Row, Col, Select, DatePicker, Flex } from "antd";
import dayjs from "dayjs";

import { type FilterItem, type FormValues } from "./filterTypes";
import styles from "./index.module.scss";

interface TableFilteringProps {
  filterList: FilterItem[];
  onSubmit: (values: FormValues) => void;
}

const TableFiltering = ({ filterList, onSubmit }: TableFilteringProps) => {
  const [form] = Form.useForm<FormValues>()

  // 重置
  const onReset = () => {
    form.resetFields();
    onSubmit(form.getFieldsValue())
  };

  // 提交
  const onFinish = (values: FormValues) => {
    const payload = Object.fromEntries(
      Object.entries(values).map(([k, v]) => {
        if (dayjs.isDayjs(v)) return [k, v.format('YYYY-MM-DD')];
        return [k, v ?? ''];
      })
    );
    onSubmit(payload)
  };

  return (
    <div className={styles["filter-card"]}>
      <Form labelCol={{ span: 6, style: { whiteSpace: 'nowrap' } }} form={form} onFinish={onFinish}>
        <Row gutter={24}>
          {filterList.map((item) => (
            <Col span={8} key={item.name}>
              <Form.Item
                label={item.label}
                name={item.name}
                initialValue={item.defaultValue ?? ''}
              >
                {item.type === "input" && <Input placeholder={item.placeholder} />}
                {item.type === "select" && <Select options={item.options} />}
                {item.type === "date" && <DatePicker placeholder={item.placeholder} style={{width: '100%'}} />}
              </Form.Item>
            </Col>
          ))}
          <Col span={8}>
            <Form.Item label={null}>
              <Flex gap="middle" wrap>
                <Button type="primary" htmlType="submit">
                  筛选
                </Button>
                <Button color="primary" variant="outlined" onClick={onReset}>
                  重置
                </Button>
              </Flex>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TableFiltering;
