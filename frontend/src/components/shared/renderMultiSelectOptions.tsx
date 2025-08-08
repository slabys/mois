import { Avatar, Group, MultiSelectProps, Text } from "@mantine/core";
import React from "react";

export const healthLimitationsData: string[] = ["Prefer Not To Say", "Other"];
export const allergenData: Record<string, { image?: string }> = {
  "Cereals containing gluten": {
    image: "",
  },
  "Crustaceans and products thereof": {
    image: "",
  },
  "Eggs and products thereof": {
    image: "",
  },
  "Fish and products thereof": {
    image: "",
  },
  "Peanuts and products thereof": {
    image: "",
  },
  "Soybeans and products thereof": {
    image: "",
  },
  "Milk and products thereof": {
    image: "",
  },
  Nuts: {
    image: "",
  },
  "Celery and products thereof": {
    image: "",
  },
  "Mustard and products thereof": {
    image: "",
  },
  "Sesame seeds and products thereof": {
    image: "",
  },
  "Sulphur dioxide and sulphites": {
    image: "",
  },
  "Lupin and products thereof": {
    image: "",
  },
  "Molluscs and products thereof": {
    image: "",
  },
  Other: {},
};

export const renderMultiSelectOption: MultiSelectProps["renderOption"] = ({ option }) => (
  <Group gap="sm">
    {allergenData[option.value]?.image ? <Avatar src={allergenData[option.value].image} size={36} radius="xl" /> : null}
    <div>
      <Text size="sm">{option.value}</Text>
    </div>
  </Group>
);
