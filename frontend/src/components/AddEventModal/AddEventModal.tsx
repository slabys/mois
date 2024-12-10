import { Button, Flex, Modal, TextInput, Textarea, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import React, { useState } from "react";

interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEventModal: React.FC<MyModalProps> = ({ isOpen, onClose }) => {
  const [since, setSince] = useState<Date | null>(null);
  const [until, setUntil] = useState<Date | null>(null);

  //TODO: dodělat form
  // const form = useForm<>({
  //   initialValues: {
  //     email: '',
  //     termsOfService: false,
  //   },
  //
  //   validate: {
  //     email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
  //   },
  // });

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      centered
      size="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <form onSubmit={onClose}>
        <Title>Add Event</Title>
        <Flex mt={16} direction="column">
          <TextInput label="Title" data-autofocus />
          <DatePickerInput label="Index the date when event starts" value={since} onChange={setSince} />
          <DatePickerInput label="Index the date when event ends" value={until} onChange={setUntil} />
          <Textarea label="Description" />
        </Flex>
        <Flex justify="center">
          <Button mt={16} type="submit">
            Add Event
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};
export default AddEventModal;
