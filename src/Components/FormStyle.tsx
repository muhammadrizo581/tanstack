import { Button, Checkbox, Form, Input } from "antd";
import { usePhone } from "../api/hooks/usePhone";
import { useEffect } from "react";

interface Phone {
  id: number;
  title: string;
  price: string;
  memories: string[];
  img: string;
  hasDelivery: boolean;
}

interface Props {
  editingItem: Phone | null;
  setEditingItem: (item: Phone | null) => void;
}

const FormStyle = ({ editingItem, setEditingItem }: Props) => {
  const [form] = Form.useForm();
  const { createPhone, updatePhone } = usePhone();

  useEffect(() => {
    if (editingItem) {
      form.setFieldsValue(editingItem);
    } else {
      form.resetFields();
    }
  }, [editingItem, form]);

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

  return (
    <section className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">📱 Add / Edit Phone</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input placeholder="Enter product title" />
        </Form.Item>

        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <Input placeholder="Enter price" />
        </Form.Item>

        <Form.Item label="Memories" name="memories">
          <Checkbox.Group className="flex flex-wrap gap-2">
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={createPhone.isPending || updatePhone.isPending}
            className="w-full"
          >
            {editingItem ? "Update" : "Save"}
          </Button>
          {editingItem && (
            <Button
              className="mt-2 w-full"
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
  );
};

export default FormStyle;
