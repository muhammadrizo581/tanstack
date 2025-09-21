import { Button, Card, List, Spin } from "antd";
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

interface Props {
  setEditingItem: (item: Phone) => void;
}

const PhonesView = ({ setEditingItem }: Props) => {
  const { getPhone, deletePhone } = usePhone();
  const { data, isLoading } = getPhone();

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deletePhone.mutate(id, {
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };

  const placeholderImg =
    "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg";

  return (
    <section className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">📋 Phone List</h2>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            md: 2,
            lg: 3,
          }}
          dataSource={data}
          renderItem={(item: Phone) => (
            <List.Item>
              <Card
                title={item.title}
                className="rounded-xl shadow-md overflow-hidden"
                extra={
                  <div className="flex gap-2">
                    <Button size="small" onClick={() => setEditingItem(item)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      danger
                      onClick={() => handleDelete(item.id)}
                      loading={deletingId === item.id}
                    >
                      Delete
                    </Button>
                  </div>
                }
              >
                <div className="w-full h-[200px] mb-3 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={
                      item.img && item.img.trim() !== ""
                        ? item.img
                        : placeholderImg
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-sm">
                  <strong>Price:</strong> {item.price}
                </p>
                <p className="text-sm">
                  <strong>Memories:</strong>{" "}
                  {item.memories?.length > 0 ? item.memories.join(", ") : "—"}
                </p>
                <p className="text-sm">
                  <strong>Delivery:</strong>{" "}
                  {item.hasDelivery ? "✅ Has Delivery" : "❌ No Delivery"}
                </p>
              </Card>
            </List.Item>
          )}
        />
      )}
    </section>
  );
};

export default PhonesView;
