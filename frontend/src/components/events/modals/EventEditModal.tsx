"use client";

import { useUpdateEvent } from "@/utils/api";
import { EventDetail } from "@/utils/api.schemas";
import RichTextEditor from "@components/Richtext/RichTextEditor";
import DateInput from "@components/primitives/DateInput";
import { Button, Flex, Group, Modal, NumberInput, SimpleGrid, Switch, TextInput } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import React from "react";

interface EventEditModalProps {
  eventDetail: EventDetail;
  isOpened: boolean;
  close: () => void;
  onSuccessEdit: () => void;
}

const EventEditModal = ({ eventDetail, isOpened, close, onSuccessEdit }: EventEditModalProps) => {
  const form = useForm<Partial<EventDetail>>({
    initialValues: {
      title: eventDetail.title,
      visible: eventDetail.visible,
      registrationDeadline: eventDetail.registrationDeadline,
      capacity: eventDetail.capacity,
      shortDescription: eventDetail.shortDescription,
      longDescription: eventDetail.longDescription,
      since: eventDetail.since,
      until: eventDetail.until,
      codeOfConductLink: eventDetail.codeOfConductLink,
      photoPolicyLink: eventDetail.photoPolicyLink,
      termsAndConditionsLink: eventDetail.termsAndConditionsLink,
    },
    validate: {
      until: (value, values) =>
        dayjs(value).isSame(dayjs(values.since)) || dayjs(value).isAfter(dayjs(values.since))
          ? null
          : "Event end must be larger then beginning of an event.",
    },
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
        onSuccessEdit();
        close();
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
    // eventUpdateMutation.mutate({
    //   eventId: eventDetail.id,
    //   data: values,
    // });
  };

  const isTouchedDirty = form.isTouched() && form.isDirty();

  return (
    <Modal size="lg" opened={isOpened} onClose={handleClose} title="Edit Event">
      <Form form={form} onSubmit={handleEventUpdate}>
        <Flex direction="column" gap={8}>
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
              value={dayjs(form.values.since).toDate()}
              onChange={(value) => {
                value && form.setFieldValue("registrationDeadline", value.toISOString());
              }}
              error={form.errors.since}
            />
          </SimpleGrid>
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
            label="Short Description"
            value={form.values.shortDescription}
            onChange={(value) => {
              form.setFieldValue("shortDescription", value);
            }}
          />
          <RichTextEditor
            label="Long Description"
            value={form.values.longDescription}
            onChange={(value) => {
              form.setFieldValue("longDescription", value);
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
