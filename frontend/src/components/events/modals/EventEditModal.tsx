"use client";

import { useUpdateEvent } from "@/utils/api";
import { EventDetail } from "@/utils/api.schemas";
import RichTextEditor from "@components/Richtext/RichTextEditor";
import DateInput from "@components/primitives/DateInput";
import { Button, Flex, Group, Modal, SimpleGrid, TextInput } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";

interface EventEditModalProps {
  eventDetail: EventDetail;
  isOpened: boolean;
  close: () => void;
}

const EventEditModal = ({ eventDetail, isOpened, close }: EventEditModalProps) => {
  const form = useForm<Partial<EventDetail>>({
    initialValues: {
      title: eventDetail.title,
      shortDescription: eventDetail.shortDescription,
      since: eventDetail.since,
      until: eventDetail.until,
    },
    validate: {},
  });

  const handleClose = () => {
    form.reset();
    close();
  };

  const eventUpdateMutation = useUpdateEvent({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "edit-event",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are updating event information.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "edit-event",
          title: "Event Edit",
          message: "Event information updated successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
      },
      onError: (error) => {
        notifications.update({
          id: "edit-event",
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

  const handleEventUpdate = (values: Partial<EventDetail>) => {
    eventUpdateMutation.mutate({
      eventId: eventDetail.id,
      data: values,
    });
  };

  const isTouchedDirty = form.isTouched() && form.isDirty();

  return (
    <Modal size="lg" opened={isOpened} onClose={handleClose} title="Edit Event">
      <Form form={form} onSubmit={handleEventUpdate}>
        <Flex direction="column" gap={8}>
          <TextInput label="Title" {...form.getInputProps("title")} />
          <SimpleGrid cols={2}>
            <DateInput
              label="Date Since"
              value={dayjs(form.values.since).toDate()}
              onChange={(value) => {
                value && form.setFieldValue("since", value.toISOString());
              }}
              error={form.errors.since}
            />
            <DateInput
              label="Date Until"
              value={dayjs(form.values.until).toDate()}
              onChange={(value) => {
                value && form.setFieldValue("until", value.toDateString());
              }}
              error={form.errors.until}
            />
          </SimpleGrid>
          <RichTextEditor
            label="Description"
            value={form.values.shortDescription}
            onChange={(value) => {
              form.setFieldValue("description", value);
            }}
          />
        </Flex>
        <Group justify="center" mt="lg">
          <Button type="submit" disabled={!isTouchedDirty} loading={eventUpdateMutation.isPending}>
            Save changes
          </Button>
        </Group>
      </Form>
    </Modal>
  );
};

export default EventEditModal;
