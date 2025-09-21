import { useState } from "react";
import FormStyle from "../Components/FormStyle";
import PhonesView from "../Components/PhonesView";

interface Phone {
  id: number;
  title: string;
  price: string;
  memories: string[];
  img: string;
  hasDelivery: boolean;
}

const Phone = () => {
  const [editingItem, setEditingItem] = useState<Phone | null>(null);

  return (
    <div className="container mx-auto pt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div className="md:col-span-1">
        <FormStyle editingItem={editingItem} setEditingItem={setEditingItem} />
      </div>

      <div className="md:col-span-2">
        <PhonesView setEditingItem={setEditingItem} />
      </div>
    </div>
  );
};

export default Phone;
