import { useCreateUserApplication, useUserOrganizationMemberships } from "@/utils/api";
import { CreateEventApplication, Organization, User } from "@/utils/api.schemas";
import { showErrorNotification, updateErrorNotification } from "@/utils/notifications";
import AddressCodeBlock from "@components/AddressCodeBlock/AddressCodeBlock";
import Select from "@components/primitives/Select";
import { Blockquote, Box, Button, Code, Flex, Grid, Modal, SimpleGrid, Stepper, Text, TextInput } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";

interface JoinEventModalProps {
  eventId: number;
  currentUser: User;
  isOpened: boolean;
  closeModal: () => void;
  handleSuccess?: () => void;
}

type InvoiceMethodsType = "personal" | "organisation" | "different";

const JoinEventModal = ({
  currentUser,
  eventId,
  isOpened,
  closeModal,
  handleSuccess = () => {},
}: JoinEventModalProps) => {
  const [selectedOrganisation, setSelectedOrganisation] = useState<Organization | null>(null);
  const [invoiceMethod, setInvoiceMethod] = useState<InvoiceMethodsType | null>(null);
  const { data: userOrganisationMemberships } = useUserOrganizationMemberships(currentUser.id);

  const form = useForm<Partial<CreateEventApplication>>({
    initialValues: {
      idNumber: undefined,
      organization: undefined,
      spotTypeId: null,
      invoiceAddress: undefined,
      additionalFormData: {},
    },
    validate: (values) => {
      const errors: Record<string, string | null> = {};

      if (!values.organization) {
        errors["organization.type"] = "Organization data is required";
      }

      if (active === 0) {
        if (!values.idNumber?.trim()) {
          errors["idNumber"] = "ID number is required";
        }

        if (values.organization?.type === "custom") {
          if (!values.organization.name?.trim()) {
            errors["organization.name"] = "Organization name is required";
          }
          if (!values.organization.country?.trim()) {
            errors["organization.country"] = "Country is required";
          }
        }

        if (values.organization?.type === "organization") {
          if (!values.organization.id) {
            errors["organization.id"] = "Organization ID is required";
          }
        }
      }

      if (active === 1) {
        if (!values.invoiceAddress) {
          errors["invoiceAddress"] = "Invoice address is required";
        }
      }

      return errors;
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

  const [active, setActive] = useState(0);
  const nextStep = () => {
    form.validate();
    if (form.isValid()) {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };
  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  if (!userOrganisationMemberships || !currentUser) {
    return null;
  }

  console.log(form.values);
  console.log(form.errors);

  return (
    <Modal size="xl" opened={isOpened} onClose={handleClose} title={<Text fz="h3">Event Application</Text>}>
      <Form form={form} onSubmit={handleEventApplication}>
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="Step 1:" description="General Information">
            <Flex direction="column" gap="md">
              <TextInput label="Person ID Number / Passport Number" {...form.getInputProps("idNumber")} required />
              <Select
                label="Select Organisation"
                value={
                  form.values.organization
                    ? form.values.organization?.type === "custom"
                      ? "null"
                      : form.values.organization.id
                    : null
                }
                data={
                  userOrganisationMemberships.length > 0
                    ? userOrganisationMemberships.map((membership) => {
                        return {
                          label: membership.organization.name,
                          value: membership.organization.id,
                        };
                      })
                    : [{ label: "Different Organisation", value: "null" }]
                }
                onChange={(value) => {
                  if (!value) return;
                  const membership = userOrganisationMemberships.find((f) => f.organization.id === value);
                  if (!membership || value === "null") {
                    form.setFieldValue("organization", {
                      type: "custom",
                      name: "",
                      country: "",
                    });
                    return;
                  }
                  form.setFieldValue("organization", {
                    type: "organization",
                    id: "",
                  });
                  setSelectedOrganisation(membership.organization);
                }}
                error={form.errors["organization.type"]}
                required
              />
              {form.values.organization?.type &&
                {
                  custom: (
                    <SimpleGrid cols={2}>
                      <TextInput label="Organisation Name" {...form.getInputProps("organization.name")} required />
                      <TextInput
                        label="Organisation Country"
                        {...form.getInputProps("organization.country")}
                        required
                      />
                    </SimpleGrid>
                  ),
                  organization: (
                    <Blockquote>
                      <Text>Organisation: {selectedOrganisation?.name}</Text>
                      <Text>
                        Manager:{" "}
                        {`${selectedOrganisation?.manager?.firstName} ${selectedOrganisation?.manager?.lastName}`}
                      </Text>
                    </Blockquote>
                  ),
                }[form.values.organization.type]}
            </Flex>
          </Stepper.Step>
          <Stepper.Step label="Step 2" description="Invoice Information">
            <Flex direction="column" gap="md">
              <Select
                label="Invoice Method"
                value={invoiceMethod}
                data={[
                  { label: "Personal Address", value: "personal" },
                  {
                    label: "Organisation Address",
                    value: "organisation",
                    disabled: !selectedOrganisation,
                  },
                  { label: "Different Invoice Address", value: "different" },
                ]}
                onChange={(value) => {
                  setInvoiceMethod(value as InvoiceMethodsType | null);
                }}
                error={form.errors["invoiceAddress"]}
                required
              />
              {invoiceMethod && (
                <Box>
                  {
                    {
                      personal: <AddressCodeBlock address={currentUser.personalAddress} />,
                      organisation: <AddressCodeBlock address={selectedOrganisation?.address} />,
                      different: (
                        <Grid>
                          <Grid.Col span={{ base: 7, md: 7 }}>
                            <TextInput label="Street" {...form.getInputProps("invoiceAddress.street")} />
                          </Grid.Col>
                          <Grid.Col span={{ base: 5, md: 5 }}>
                            <TextInput label="House No." {...form.getInputProps("invoiceAddress.houseNumber")} />
                          </Grid.Col>
                          <Grid.Col span={{ base: 5, md: 6 }}>
                            <TextInput label="ZIP code" {...form.getInputProps("invoiceAddress.zip")} />
                          </Grid.Col>
                          <Grid.Col span={{ base: 7, md: 6 }}>
                            <TextInput label="City" {...form.getInputProps("invoiceAddress.city")} />
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, md: 12 }}>
                            <TextInput label="Country" {...form.getInputProps("invoiceAddress.country")} />
                          </Grid.Col>
                        </Grid>
                      ),
                    }[invoiceMethod]
                  }
                </Box>
              )}
            </Flex>
          </Stepper.Step>
          <Stepper.Step label="Step 3" description="Additional Information"></Stepper.Step>
          <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
        </Stepper>

        <Flex mt={16} gap={8} justify="space-between">
          <Button variant="default" onClick={prevStep} disabled={active === 0}>
            Back
          </Button>
          {active !== 3 ? (
            <Button onClick={nextStep}>Next step</Button>
          ) : (
            <Button type="submit" disabled={!isTouchedDirty} loading={eventApplicationMutation.isPending}>
              Submit application
            </Button>
          )}
        </Flex>
        <Flex direction="column" gap={16}>
          <Box>
            <Text fz="sm">Personal address:</Text>
            <Code block>
              {`${currentUser.personalAddress?.street} ${currentUser.personalAddress?.zip}
${currentUser.personalAddress?.zip} ${currentUser.personalAddress?.city}
${currentUser.personalAddress?.country}`}
            </Code>
          </Box>
        </Flex>
      </Form>
    </Modal>
  );
};
export default JoinEventModal;
