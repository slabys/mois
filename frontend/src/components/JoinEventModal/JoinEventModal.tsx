import { useCreateUserApplication, useGetEventSpots } from "@/utils/api";
import { CreateAddress, CreateEventApplication, User } from "@/utils/api.schemas";
import { Button, ComboboxData, Flex, Group, Modal, Text, TextInput, Title } from "@mantine/core";
import { Form, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React from "react";

interface JoinEventModalProps {
  eventId: number;
  userData: User;
  isOpened: boolean;
  closeModal: () => void;
  onSuccess: () => void;
}

const JoinEventModal = ({ userData, eventId, onSuccess, isOpened, closeModal }: JoinEventModalProps) => {
  const { data: eventSpots } = useGetEventSpots(eventId);

  const form = useForm<Partial<CreateEventApplication>>({
    initialValues: {
      organization: {
        type: "custom",
        name: "",
        country: "",
      },
      additionalFormData: {},
      spotTypeId: null,
      invoiceAddress: {
        country: userData?.personalAddress.country ?? "",
        city: userData?.personalAddress.city ?? "",
        street: userData?.personalAddress.street ?? "",
        houseNumber: userData?.personalAddress.houseNumber ?? "",
        zip: userData?.personalAddress.zip ?? "",
      },
      idNumber: "",
    },
    validate: {
      organization: {
        type: isNotEmpty("This field should not be empty"),
        name: isNotEmpty("This field should not be empty"),
        country: isNotEmpty("This field should not be empty"),
      },
      idNumber: isNotEmpty("This file should not be empty"),
    },
  });

  const isTouchedDirty = form.isTouched() && form.isDirty();

  const handleClose = () => {
    form.reset();
    closeModal();
  };

  const createEventApplication = useCreateUserApplication({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "create-user-application",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are create event.",
          autoClose: false,
        });
      },
      onSuccess: (data) => {
        notifications.update({
          id: "create-user-application",
          title: "Event Edit",
          message: "Event create updated successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        onSuccess();
        form.reset();
        closeModal();
      },
      onError: (error) => {
        notifications.update({
          id: "create-user-application",
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

  const handleCreateEvent = (submitValues: Partial<CreateEventApplication>) => {
    form.validate();
    if (form.isValid()) {
      createEventApplication.mutate({
        eventId: eventId,
        data: submitValues as CreateEventApplication,
      });
    }
  };

  const spots: ComboboxData =
    eventSpots?.map((spot) => {
      return { value: spot.id.toString(), label: spot.name };
    }) ?? [];

  const isInvoiceAdress = (address: CreateAddress | undefined) => {
    return address ? Object.entries(address).some(([_key, value]) => (value as string)?.length > 0) : undefined;
  };

  return (
    <Modal size="xl" opened={isOpened} onClose={handleClose} title="Create Event">
      <Form form={form} onSubmit={handleCreateEvent}>
        <Flex direction="column" gap={16}>
          <Title order={3}>Organisation Info</Title>
          <TextInput label="Organisation Name" {...form.getInputProps("organization.name")} required />
          <TextInput label="Organisation Country" {...form.getInputProps("organization.country")} required />
          {/*<Select*/}
          {/*  label="Select spot"*/}
          {/*  data={spots}*/}
          {/*  searchable*/}
          {/*  nothingFoundMessage="Nothing found..."*/}
          {/*  allowDeselect*/}
          {/*  required*/}
          {/*/>*/}
          <TextInput label="Person ID Number / Passport Number" {...form.getInputProps("idNumber")} required />
          <Flex direction="column" gap={16}>
            <Text>Invoice address</Text>
            <TextInput
              label="Country"
              {...form.getInputProps("invoiceAddress.country")}
              required={isInvoiceAdress(form.values.invoiceAddress)}
            />
            <TextInput
              label="City"
              {...form.getInputProps("invoiceAddress.city")}
              required={isInvoiceAdress(form.values.invoiceAddress)}
            />
            <TextInput
              label="Street"
              {...form.getInputProps("invoiceAddress.street")}
              required={isInvoiceAdress(form.values.invoiceAddress)}
            />
            <TextInput
              label="House Number"
              {...form.getInputProps("invoiceAddress.houseNumber")}
              required={isInvoiceAdress(form.values.invoiceAddress)}
            />
            <TextInput
              label="zip"
              {...form.getInputProps("invoiceAddress.zip")}
              required={isInvoiceAdress(form.values.invoiceAddress)}
            />
          </Flex>
        </Flex>
        <Group justify="center" mt="lg">
          <Button type="submit" disabled={!isTouchedDirty} loading={createEventApplication.isPending}>
            Save changes
          </Button>
        </Group>
      </Form>
    </Modal>
  );
};
export default JoinEventModal;
