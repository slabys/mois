import { useCreateUserApplication, useGetEventSpots } from "@/utils/api";
import { CreateEventApplication, User } from "@/utils/api.schemas";
import { showErrorNotification, updateErrorNotification } from "@/utils/notifications";
import { Box, Button, Code, Flex, Group, Modal, Text, TextInput, Title } from "@mantine/core";
import { Form, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";

interface JoinEventModalProps {
  eventId: number;
  currentUser: User;
  isOpened: boolean;
  closeModal: () => void;
  handleSuccess?: () => void;
}

const JoinEventModal = ({
  currentUser,
  eventId,
  isOpened,
  closeModal,
  handleSuccess = () => {},
}: JoinEventModalProps) => {
  const { data: eventSpots } = useGetEventSpots(eventId);

  const form = useForm<Partial<CreateEventApplication>>({
    initialValues: {
      organization: {
        type: "custom",
        name: "",
        country: "",
      },
      idNumber: "",
      // invoiceAddress:
      //   userData.personalAddress !== null
      //     ? {
      //         country: userData?.personalAddress.country ?? "",
      //         city: userData?.personalAddress.city ?? "",
      //         street: userData?.personalAddress.street ?? "",
      //         houseNumber: userData?.personalAddress.houseNumber ?? "",
      //         zip: userData?.personalAddress.zip ?? "",
      //       }
      //     : undefined,
      additionalFormData: {},
    },
    validate: {
      organization: {
        type: isNotEmpty("This field should not be empty"),
        name: isNotEmpty("This field should not be empty"),
        country: isNotEmpty("This field should not be empty"),
      },
      idNumber: isNotEmpty("This file should not be empty"),
      invoiceAddress: isNotEmpty("This field should not be empty"),
    },
  });

  const isTouchedDirty = form.isTouched() && form.isDirty();

  const handleClose = () => {
    form.reset();
    closeModal();
  };

  const eventApplicationMutation = useCreateUserApplication({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "event-application",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are processing your event application.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "event-application",
          title: "Event Application",
          message: "Event Application created successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        handleSuccess();
        form.reset();
        closeModal();
      },
      onError: (mutationError) => {
        if (!mutationError.response?.data) return;
        updateErrorNotification("event-application");
        showErrorNotification(mutationError);
      },
    },
  });

  const handleEventApplication = (submitValues: Partial<CreateEventApplication>) => {
    form.validate();
    if (form.isValid()) {
      eventApplicationMutation.mutate({
        eventId: eventId,
        data: submitValues as CreateEventApplication,
      });
    }
  };

  const [active, setActive] = useState(1);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Modal size="xl" opened={isOpened} onClose={handleClose} title="Event Application">
      <Form form={form} onSubmit={handleEventApplication}>
        {/*<Stepper active={active} onStepClick={setActive}>*/}
        {/*  <Stepper.Step label="First step" description="Create an account">*/}
        {/*    Step 1 content: Create an account*/}
        {/*  </Stepper.Step>*/}
        {/*  <Stepper.Step label="Second step" description="Verify email">*/}
        {/*    Step 2 content: Verify email*/}
        {/*  </Stepper.Step>*/}
        {/*  <Stepper.Step label="Final step" description="Get full access">*/}
        {/*    Step 3 content: Get full access*/}
        {/*  </Stepper.Step>*/}
        {/*  <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>*/}
        {/*</Stepper>*/}
        <Flex direction="column" gap={16}>
          <Title order={3}>Organisation Info</Title>
          <TextInput label="Organisation Name" {...form.getInputProps("organization.name")} required />
          <TextInput label="Organisation Country" {...form.getInputProps("organization.country")} required />
          <TextInput label="Person ID Number / Passport Number" {...form.getInputProps("idNumber")} required />
          <Box>
            <Text fz="sm">Personal address:</Text>
            <Code block>
              {`${currentUser.personalAddress.street} ${currentUser.personalAddress.zip}
${currentUser.personalAddress.zip} ${currentUser.personalAddress.city}
${currentUser.personalAddress.country}`}
            </Code>
          </Box>
          <Flex direction="column" gap={16}>
            <Text>Invoice address</Text>
            <TextInput label="Country" {...form.getInputProps("invoiceAddress.country")} />
            <TextInput label="City" {...form.getInputProps("invoiceAddress.city")} />
            <TextInput label="Street" {...form.getInputProps("invoiceAddress.street")} />
            <TextInput label="House Number" {...form.getInputProps("invoiceAddress.houseNumber")} />
            <TextInput label="zip" {...form.getInputProps("invoiceAddress.zip")} />
          </Flex>
        </Flex>
        <Group justify="center" mt="lg">
          <Button type="submit" disabled={!isTouchedDirty} loading={eventApplicationMutation.isPending}>
            Save changes
          </Button>
        </Group>
      </Form>
    </Modal>
  );
};
export default JoinEventModal;
