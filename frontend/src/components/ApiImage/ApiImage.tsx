import { useGetPhoto } from "@/utils/api";
import { Image, ImageProps } from "@mantine/core";

interface ApiImageProps extends ImageProps {
  src: string;
}

const ApiImage = ({ src, ...props }: ApiImageProps) => {
  const { data: photo } = useGetPhoto(src);
  if (src.startsWith("http") || src.startsWith("https")) {
    return <Image src={src} alt="Image from API" {...props} />;
  }
  return photo ? (
    <Image src={photo} alt="Image from API" {...props} />
  ) : (
    <Image src="/imagePlaceholder.svg" alt="Placeholder Image" {...props} />
  );
};

export default ApiImage;
