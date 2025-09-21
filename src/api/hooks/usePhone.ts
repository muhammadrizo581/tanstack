import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "..";
import type { Phone } from "../../types/types";

export const usePhone = () => {
  const client = useQueryClient();

  const getPhone = () =>
    useQuery<Phone[], Error>({
      queryKey: ["phoneKey"],
      queryFn: () => api.get("phone").then((res) => res.data),
    });

  const createPhone = useMutation<Phone, Error, Phone>({
    mutationFn: (body: Phone) =>
      api.post("phone", body).then((res) => res.data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["phoneKey"] });
    },
  });

  const deletePhone = useMutation<Phone, Error, number>({
    mutationFn: (id: number) =>
      api.delete(`phone/${id}`).then((res) => res.data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["phoneKey"] });
    },
  });

  const updatePhone = useMutation<Phone, Error, Phone>({
    mutationFn: (body: Phone) =>
      api.put(`phone/${body.id}`, body).then((res) => res.data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["phoneKey"] });
    },
  });

  return { getPhone, createPhone, deletePhone, updatePhone };
};
