import { Button, Checkbox, Form, Input, Card, List, Spin } from "antd";
import { usePhone } from "../api/hooks/usePhone";
import { useState } from "react";
interface Phone {
  id: number;
  title: string;
  price: string;
  memories: string[];
  img: string;
  hasDelivery: boolean;
}

const FormStyle = () => {
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState<Phone | null>(null);

  const { getPhone, createPhone, deletePhone, updatePhone } = usePhone();
  const { data, isLoading } = getPhone();

  const onFinish = (values: any) => {
    const phone: Phone = {
      id: editingItem ? editingItem.id : Date.now(),
      title: values.title || "",
      price: values.price || "",
      memories: values.memories || [],
      img: values.img || "",
      hasDelivery: values.hasDelivery || false,
    };

    if (editingItem) {
      updatePhone.mutate(phone, {
        onSuccess: () => {
          setEditingItem(null);
          form.resetFields();
        },
      });
    } else {
      createPhone.mutate(phone, {
        onSuccess: () => {
          form.resetFields();
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    deletePhone.mutate(id);
  };

  const handleEdit = (item: Phone) => {
    setEditingItem(item);
    form.setFieldsValue(item);
  };

  return (
    <div className="flex container mx-auto gap-20">
      <section className="pt-[100px]">
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input placeholder="Enter product title" />
          </Form.Item>

          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <Input placeholder="Enter price" />
          </Form.Item>

          <Form.Item label="Memories" name="memories">
            <Checkbox.Group>
              <Checkbox value="128GB">128GB</Checkbox>
              <Checkbox value="256GB">256GB</Checkbox>
              <Checkbox value="512GB">512GB</Checkbox>
              <Checkbox value="1TB">1TB</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="Image URL" name="img">
            <Input placeholder="Enter image URL" />
          </Form.Item>

          <Form.Item
            label="Has Delivery 🚚"
            name="hasDelivery"
            valuePropName="checked"
          >
            <Checkbox>Yes ✅</Checkbox>
          </Form.Item>

          <Form.Item label=" ">
            <Button
              type="primary"
              htmlType="submit"
              loading={createPhone.isPending || updatePhone.isPending}
            >
              {editingItem ? "Update" : "Save"}
            </Button>
            {editingItem && (
              <Button
                className="ml-2"
                onClick={() => {
                  setEditingItem(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            )}
          </Form.Item>
        </Form>
      </section>

      <div className="mt-[100px] w-[400px]">
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={data}
            renderItem={(item: Phone) => (
              <List.Item>
                <Card
                  title={item.title}
                  extra={
                    <div className="flex gap-2">
                      <Button size="small" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        danger
                        onClick={() => handleDelete(item.id)}
                        loading={deletePhone.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  }
                >
                  {item.img && (
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                  <p>
                    <strong>Price:</strong> {item.price}
                  </p>
                  <p>
                    <strong>Memories:</strong>{" "}
                    {item.memories?.length > 0 ? item.memories.join(", ") : "—"}
                  </p>
                  <p>
                    <strong>Delivery:</strong>{" "}
                    {item.hasDelivery ? "✅ Has Delivery" : "❌ No Delivery"}
                  </p>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default FormStyle;
