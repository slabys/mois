import { getGetEventsQueryKey, useCreateEvent } from "@/utils/api";
import { CreateEvent, CreateEventLinkPartial } from "@/utils/api.schemas";
import Modal from "@components/Modal/Modal";
import RichTextEditor from "@components/Richtext/RichTextEditor";
import DateInput from "@components/primitives/DateInput";
import { ActionIcon, Button, Fieldset, Flex, Group, NumberInput, SimpleGrid, Switch, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Form, hasLength, isNotEmpty, useForm } from "@mantine/form";
import { IconLinkPlus, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";

type FormCreateEvent = Omit<CreateEvent, "links"> & {
  links: (CreateEventLinkPartial & {
    customId: string;
  })[];
};

interface MyModalProps {
  isOpened: boolean;
  closeModal: () => void;
  onCreateSuccess: () => void;
}

const CreateEventModal = ({ onCreateSuccess, isOpened, closeModal }: MyModalProps) => {
  const queryClient = useQueryClient();

  const createEventMutation = useCreateEvent({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getGetEventsQueryKey()] });
        onCreateSuccess();
        form.reset();
        closeModal();
      },
    },
  });

  const form = useForm<Partial<FormCreateEvent>>({
    initialValues: {
      visible: false,
      title: undefined,
      capacity: 0,
      shortDescription: "",
      longDescription: "",
      links: [],
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

  const handleCreateEvent = (submitValues: Partial<FormCreateEvent>) => {
    form.validate();
    if (form.isValid()) {
      createEventMutation.mutate({
        data: submitValues as CreateEvent,
      });
    }
  };

  const isTouchedDirty = form.isTouched() && form.isDirty();

  const handleRemoveLink = (customId: string) => {
    form.setFieldValue("links", (prevValue) => prevValue?.filter((value) => value.customId !== customId) ?? []);
  };

  const handleAddNewLink = () => {
    form.setFieldValue("links", (prevValue) => {
      return [
        ...(prevValue ?? []),
        {
          customId: crypto.randomUUID(),
          name: "",
          link: "",
        },
      ];
    });
  };

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
            <DateTimePicker
              label="Registration Deadline"
              value={dayjs(form.values.registrationDeadline).toDate()}
              onChange={(value) => {
                value && form.setFieldValue("registrationDeadline", dayjs(value).toISOString());
              }}
              error={form.errors.registrationDeadline}
              timePickerProps={{
                withDropdown: true,
              }}
            />
            <DateInput
              label="Event Date Since"
              value={dayjs(form.values.since).toDate()}
              onChange={(value) => {
                value && form.setFieldValue("since", dayjs(value).toISOString());
              }}
              error={form.errors.since}
            />
            <DateInput
              label="Event Date Until"
              value={dayjs(form.values.until).toDate()}
              onChange={(value) => {
                value && form.setFieldValue("until", dayjs(value).toISOString());
              }}
              error={form.errors.until}
            />
          </SimpleGrid>
          <RichTextEditor label="Short Description" {...form.getInputProps("shortDescription")} letterLimit={300} />
          <RichTextEditor label="Long Description" {...form.getInputProps("longDescription")} />
          <TextInput label="Terms and Conditions Link" {...form.getInputProps("termsAndConditionsLink")} />
          <TextInput label="Code of Conduct Link" {...form.getInputProps("codeOfConductLink")} />
          <TextInput label="Photo Consent Link" {...form.getInputProps("photoPolicyLink")} />
          <Fieldset legend="Link tree" variant="filled" p={16}>
            <Flex direction="column" gap={8} w="100%">
              {form.values.links?.map((value, index) => {
                return (
                  <Flex key={`link-tree-create-${index}-${value.customId}`} w="100%" gap={16}>
                    <Flex direction={{ base: "column", md: "row" }} w="100%" gap={{ base: 8, md: 16 }}>
                      <TextInput
                        label="Name"
                        placeholder="ERS link"
                        w="100%"
                        value={value.name}
                        onChange={(event) => {
                          event.preventDefault();
                          form.setFieldValue(`links.${index}.name`, event.currentTarget.value);
                        }}
                      />
                      <TextInput
                        label="URL"
                        placeholder="https://www.ers.cz/"
                        w="100%"
                        value={value.link}
                        onChange={(event) => {
                          form.setFieldValue(`links.${index}.link`, event.currentTarget.value);
                        }}
                      />
                    </Flex>
                    <Flex w="fit-content" justify="center" align="center">
                      <ActionIcon
                        onClick={() => handleRemoveLink(value.customId)}
                        variant="light"
                        color="red"
                        size="lg"
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Flex>
                  </Flex>
                );
              })}
            </Flex>
            <Flex justify="center" align="center" mt={16}>
              <Button leftSection={<IconLinkPlus />} onClick={handleAddNewLink} variant="light">
                Add new link
              </Button>
            </Flex>
          </Fieldset>
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
