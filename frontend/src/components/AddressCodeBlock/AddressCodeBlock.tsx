import { Address } from "@/utils/api.schemas";
import { Code, CodeProps } from "@mantine/core";
import React from "react";

interface AddressCodeBlockProps extends CodeProps {
  address?: Address | null;
}

const AddressCodeBlock = ({ address, ...props }: AddressCodeBlockProps) => {
  if (!address) return null;
  return (
    <Code block {...props}>
      {`${address.street} ${address.zip}
${address.zip} ${address.city}
${address.country}`}
    </Code>
  );
};

export default AddressCodeBlock;
