import { Photo } from "@/utils/api.schemas";

export const apiImageURL = (photo: Photo | string | undefined | null) => {
  if (!photo) return "/imagePlaceholder.svg";
  if (typeof photo === "string") return `${process.env.NEXT_PUBLIC_APP1_URL}/photo/${photo}`;
  return `${process.env.NEXT_PUBLIC_APP1_URL}/photo/${photo.id}`;
};
