import { useCreateEvent } from "@/utils/api";
import { CreateEvent } from "@/utils/api.schemas";
import RichTextEditor from "@components/Richtext/RichTextEditor";
import DateInput from "@components/primitives/DateInput";
import { Button, Flex, Group, Modal, NumberInput, SimpleGrid, Switch, TextInput } from "@mantine/core";
import { Form, hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import React from "react";

interface MyModalProps {
  isOpened: boolean;
  closeModal: () => void;
  onCreateSuccess: () => void;
}

const CreateEventModal: React.FC<MyModalProps> = ({ onCreateSuccess, isOpened, closeModal }) => {
  const createEventMutation = useCreateEvent({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "create-event",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are create event.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "create-event",
          title: "Event Edit",
          message: "Event create updated successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        onCreateSuccess();
        form.reset();
        closeModal();
      },
      onError: (error) => {
        notifications.update({
          id: "create-event",
          title: "Something went wrong.",
          message: "Please check all information first. Then try again.",
          color: "red",
          loading: false,
          autoClose: true,
        });
        // @ts-ignore - message
        if (error.response?.data && error.response.data.message) {
          // @ts-ignore - message
          (error.response.data.message as string[]).forEach((err) => {
            notifications.show({
              title: "Error",
              message: err,
              color: "red",
            });
          });
        }
      },
    },
  });

  const form = useForm<Partial<CreateEvent>>({
    initialValues: {
      visible: false,
      title: undefined,
      capacity: 0,
      shortDescription: "",
      longDescription: "",
      since: new Date().toISOString(),
      until: new Date().toISOString(),
      registrationDeadline: new Date().toISOString(),
      termsAndConditionsLink: undefined,
      codeOfConductLink: undefined,
      photoPolicyLink: undefined,
      generateInvoices: false,
      registrationForm: {},
    },
    validate: {
      title: hasLength({ min: 6 }, "Must be at least 6 characters"),
      shortDescription: hasLength({ min: 30 }, "Must be at least 30 characters"),
      longDescription: hasLength({ min: 30 }, "Must be at least 30 characters"),
      capacity: (value) => (!!value && value < 0 ? "Must be larger than or equal to 0" : null),
      termsAndConditionsLink: isNotEmpty("This field should not be empty."),
      codeOfConductLink: isNotEmpty("This field should not be empty."),
      photoPolicyLink: isNotEmpty("This field should not be empty."),
    },
  });

  const handleCreateEvent = (submitValues: Partial<CreateEvent>) => {
    form.validate();
    if (form.isValid()) {
      createEventMutation.mutate({
        data: submitValues as CreateEvent,
      });
    }
  };

  const isTouchedDirty = form.isTouched() && form.isDirty();

  const handleClose = () => {
    form.reset();
    closeModal();
  };

  return (
    <Modal size="xl" opened={isOpened} onClose={handleClose} title="Create Event">
      <Form form={form} onSubmit={handleCreateEvent}>
        <Flex direction="column" gap={16}>
          <Switch
            label={`Is published: ${form.values.visible}`}
            defaultChecked={form.values.visible}
            {...form.getInputProps("visible")}
          />
          <TextInput label="Title" {...form.getInputProps("title")} />
          <SimpleGrid cols={2}>
            <NumberInput
              label="Capacity"
              defaultValue={0}
              min={0}
              {...form.getInputProps("capacity")}
              error={form.errors.capacity}
            />
            <DateInput
              label="Registration Deadline"
              value={dayjs(form.values.registrationDeadline).toDate()}
              onChange={(value) => {
                value && form.setFieldValue("registrationDeadline", value.toISOString());
              }}
              error={form.errors.registrationDeadline}
            />
            <DateInput
              label="Event Date Since"
              value={dayjs(form.values.since).toDate()}
              onChange={(value) => {
                value && form.setFieldValue("since", value.toISOString());
              }}
              error={form.errors.since}
            />
            <DateInput
              label="Event Date Until"
              value={dayjs(form.values.until).toDate()}
              onChange={(value) => {
                value && form.setFieldValue("until", value.toISOString());
              }}
              error={form.errors.until}
            />
          </SimpleGrid>
          <RichTextEditor label="Short Description" {...form.getInputProps("shortDescription")} />
          <RichTextEditor label="Long Description" {...form.getInputProps("longDescription")} />
          <TextInput label="Terms and Conditions Link" {...form.getInputProps("termsAndConditionsLink")} />
          <TextInput label="Code of Conduct Link" {...form.getInputProps("codeOfConductLink")} />
          <TextInput label="Photo Policy Link" {...form.getInputProps("photoPolicyLink")} />
        </Flex>
        <Group justify="center" mt="lg">
          <Button type="submit" disabled={!isTouchedDirty} loading={createEventMutation.isPending}>
            Save changes
          </Button>
        </Group>
      </Form>
    </Modal>
  );
};
export default CreateEventModal;
