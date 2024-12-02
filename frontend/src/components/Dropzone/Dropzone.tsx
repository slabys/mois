import { Group, Text, rem } from "@mantine/core";
import {
  Dropzone as DropzoneMantine,
  FileWithPath,
  IMAGE_MIME_TYPE,
  DropzoneProps as MantineDropzoneProps,
} from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

interface DropzoneProps extends Partial<MantineDropzoneProps> {
  handleOnDrop: (files: FileWithPath[]) => void;
}

export function Dropzone({ handleOnDrop, ...props }: DropzoneProps) {
  return (
    <DropzoneMantine
      onDrop={(files) => {
        handleOnDrop(files);
      }}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={5 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      {...props}
    >
      <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
        <DropzoneMantine.Accept>
          <IconUpload style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }} stroke={1.5} />
        </DropzoneMantine.Accept>
        <DropzoneMantine.Reject>
          <IconX style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }} stroke={1.5} />
        </DropzoneMantine.Reject>
        <DropzoneMantine.Idle>
          <IconPhoto style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
        </DropzoneMantine.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select file
          </Text>
        </div>
      </Group>
    </DropzoneMantine>
  );
}
