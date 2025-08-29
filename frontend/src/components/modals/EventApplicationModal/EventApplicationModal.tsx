import { useCreateUserApplication, useUserOrganizationMemberships } from "@/utils/api";
import { CreateEventApplication, CreateEventApplicationInvoiceMethod, Organization, User } from "@/utils/api.schemas";
import useStepper from "@/utils/useStepper";
import AddressCodeBlock from "@components/AddressCodeBlock/AddressCodeBlock";
import DateInput from "@components/primitives/DateInput";
import Select from "@components/primitives/Select";
import {
  allergenData,
  healthLimitationsData,
  renderMultiSelectOption,
} from "@components/shared/renderMultiSelectOptions";
import {
  Anchor,
  Blockquote,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Modal,
  MultiSelect,
  SimpleGrid,
  Stepper,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";

interface JoinEventModalProps {
  eventId: number;
  currentUser: User;
  isOpened: boolean;
  closeModal: () => void;
  handleSuccess?: () => void;
}

type InvoiceMethodsType = "personal" | "organisation" | "different";

const EventApplicationModal = ({
  currentUser,
  eventId,
  isOpened,
  closeModal,
  handleSuccess = () => {},
}: JoinEventModalProps) => {
  const [foodRestrictionList, setFoodRestrictionList] = useState<string[]>([]);
  const [healthLimitationsList, setHealthLimitationsList] = useState<string[]>([]);
  const [selectedOrganisation, setSelectedOrganisation] = useState<Organization | null>(null);
  const [invoiceMethod, setInvoiceMethod] = useState<InvoiceMethodsType | undefined>(undefined);

  const { data: userOrganisationMemberships } = useUserOrganizationMemberships(currentUser.id);

  const form = useForm<Partial<CreateEventApplication>>({
    initialValues: {
      validUntil: undefined,
      idNumber: undefined,
      organization: undefined,
      spotTypeId: null,
      invoicedTo: null,
      invoiceAddress: undefined,
      invoiceMethod: undefined,
      additionalInformation: "",
      foodRestrictionAllergies: "",
      healthLimitations: "",
      additionalFormData: {},
    },
    validate: (values) => {
      const errors: Record<string, string | null> = {};

      if (!values.organization) {
        errors["organization.type"] = "Organization data is required";
      }

      if (activeStep === 0) {
        if (!values.validUntil) {
          errors["validUntil"] = "ID/Passport valid until date is required";
        }

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

      if (activeStep === 1) {
        if (!values.invoiceAddress) {
          errors["invoiceAddress"] = "Invoice address is required";
        }
      }

      return errors;
    },
    transformValues: (values) => {
      const { foodRestrictionAllergies, healthLimitations, ...restValues } = values;

      return {
        ...restValues,
        foodRestrictionAllergies:
          foodRestrictionList.length > 0
            ? `${foodRestrictionList.sort().join(", ")}${foodRestrictionList.includes("Other") ? `, ${foodRestrictionAllergies}` : ""}`
            : foodRestrictionAllergies,
        healthLimitations:
          healthLimitationsList.length > 0
            ? `${healthLimitationsList.sort().join(", ")}${healthLimitationsList.includes("Other") ? `, ${healthLimitations}` : ""}`
            : healthLimitations,
      };
    },
  });

  const { activeStep, setActiveStep, onClickStep, nextStep, prevStep } = useStepper(form);

  const isTouchedDirty = form.isTouched() && form.isDirty();

  const handleClose = () => {
    form.reset();
    onClickStep(0);
    closeModal();
  };

  const eventApplicationMutation = useCreateUserApplication({
    mutation: {
      onSuccess: () => {
        handleSuccess();
        form.reset();
        closeModal();
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

  if (!userOrganisationMemberships || !currentUser) {
    return null;
  }

  return (
    <Modal size="xl" opened={isOpened} onClose={handleClose} title={<Text fz="h3">Event Application</Text>}>
      <Form form={form} onSubmit={handleEventApplication}>
        <Stepper active={activeStep} onStepClick={setActiveStep}>
          <Stepper.Step label="Step 1:" description="General Information">
            <Flex direction="column" gap="md">
              <SimpleGrid cols={2}>
                <TextInput label="Person ID Number / Passport Number" {...form.getInputProps("idNumber")} required />
                <DateInput
                  label="Valid until (ID/Passport)"
                  defaultValue={null}
                  placeholder="ID/Passport valid until"
                  value={form.values.validUntil ? dayjs(form.values.validUntil).toDate() : null}
                  onChange={(value) => {
                    value && form.setFieldValue("validUntil", dayjs(value).toISOString());
                  }}
                  error={form.errors.validUntil}
                  required
                />
              </SimpleGrid>
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
                    ? [
                        ...userOrganisationMemberships.map((membership) => {
                          return {
                            label: membership.organization.name,
                            value: membership.organization.id,
                          };
                        }),
                        {
                          label: "Different Organisation",
                          value: "null",
                        },
                      ]
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
                    id: membership.organization.id,
                  });
                  setSelectedOrganisation(membership.organization);
                }}
                error={form.errors["organization.type"]}
                clearable={false}
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
                  { label: "Personal Address", value: "personal", disabled: !currentUser.personalAddress },
                  {
                    label: "Organisation Address",
                    value: "organisation",
                    disabled: !selectedOrganisation,
                  },
                  { label: "Different Invoice Address", value: "different" },
                ]}
                onChange={(value) => {
                  if (!value) return;
                  setInvoiceMethod(value as InvoiceMethodsType);
                  form.setFieldValue("invoiceMethod", value as CreateEventApplicationInvoiceMethod);
                  switch (value) {
                    case "personal": {
                      if (!currentUser.personalAddress) return;
                      form.setFieldValue("invoicedTo", `${currentUser.firstName} ${currentUser.lastName}`);
                      form.setFieldValue("invoiceAddress", {
                        city: currentUser.personalAddress.city,
                        country: currentUser.personalAddress.country,
                        houseNumber: currentUser.personalAddress.houseNumber,
                        street: currentUser.personalAddress.street,
                        zip: currentUser.personalAddress.zip,
                      });
                      break;
                    }
                    case "organisation": {
                      if (!selectedOrganisation) return;
                      form.setFieldValue("invoicedTo", selectedOrganisation.name);
                      form.setFieldValue("invoiceAddress", {
                        city: selectedOrganisation.address.city,
                        country: selectedOrganisation.address.country,
                        houseNumber: selectedOrganisation.address.houseNumber,
                        street: selectedOrganisation.address.street,
                        zip: selectedOrganisation.address.zip,
                      });
                      break;
                    }
                    case "different": {
                      form.setFieldValue("invoiceAddress", undefined);
                      form.setFieldValue("invoicedTo", null);
                    }
                  }
                }}
                error={form.errors["invoiceAddress"]}
                clearable={false}
                required
              />
              {invoiceMethod && (
                <Box>
                  {
                    {
                      personal: (
                        <Box>
                          <AddressCodeBlock
                            beforeAddress={form.values.invoicedTo}
                            address={currentUser.personalAddress}
                          />
                        </Box>
                      ),
                      organisation: (
                        <Box>
                          <Text>{selectedOrganisation?.name}</Text>
                          <AddressCodeBlock
                            beforeAddress={form.values.invoicedTo}
                            address={selectedOrganisation?.address}
                          />
                        </Box>
                      ),
                      different: (
                        <Grid>
                          <Grid.Col span={{ base: 12 }}>
                            <TextInput label="Invoiced To" {...form.getInputProps("invoicedTo")} />
                          </Grid.Col>
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
          <Stepper.Step label="Step 3" description="Additional Information">
            <Flex direction="column" gap="md">
              <MultiSelect
                label="Food Restrictions and allergies"
                data={Object.entries(allergenData).map(([key]) => key)}
                renderOption={renderMultiSelectOption}
                onChange={(value) => {
                  setFoodRestrictionList(value);
                }}
                description={
                  <Text fz="xs">
                    Full allergen list:{" "}
                    <Anchor
                      fz="xs"
                      href="https://drive.google.com/file/d/1XxX40NTKs0JpGHIHPngrAyGWw1_paa8N/view"
                      target="_blank"
                    >
                      link
                    </Anchor>
                  </Text>
                }
                hidePickedOptions
                clearable
              />
              {foodRestrictionList.includes("Other") && (
                <Textarea
                  label="Food Restrictions and allergies (Other)"
                  {...form.getInputProps("foodRestrictionAllergies")}
                  autosize
                />
              )}
              <MultiSelect
                label="Disability or Health Limitations"
                data={healthLimitationsData}
                onChange={(value) => {
                  setHealthLimitationsList(value);
                }}
              />
              {healthLimitationsList.includes("Other") && (
                <Textarea
                  label="Disability or Health Limitations (Other)"
                  {...form.getInputProps("healthLimitations")}
                  autosize
                />
              )}
              <Textarea label="Additional Information" {...form.getInputProps("additionalInformation")} autosize />
            </Flex>
          </Stepper.Step>
          <Stepper.Completed>
            <Flex direction="column" gap="md">
              <Checkbox
                label={
                  <Text>
                    I agree with{" "}
                    <Link
                      href="https://drive.google.com/file/d/1F3_rMeT2Gv6cFux4EE73iW7pN1k1cIYf/view?pli=1"
                      target="_blank"
                    >
                      Terms and conditions
                    </Link>
                  </Text>
                }
                required
              />
              <Checkbox
                label={
                  <Text>
                    I agree with{" "}
                    <Link
                      href="https://drive.google.com/file/d/1dWT-2mBct7T7SUhgRpAtctQUtB1Kj5ce/view?usp=sharing"
                      target="_blank"
                    >
                      Photo Consent
                    </Link>
                  </Text>
                }
                required
              />
              <Checkbox
                label={
                  <Text>
                    I agree with{" "}
                    <Link href="https://drive.google.com/file/d/17akNt_7pXKAfaBDPmSotOUvJoyxZwhXf/view" target="_blank">
                      Code of Conduct
                    </Link>
                  </Text>
                }
                required
              />
            </Flex>
            <Flex mt={16} gap={8} justify="center" align="center">
              <Button type="submit" disabled={!isTouchedDirty} loading={eventApplicationMutation.isPending}>
                Submit application
              </Button>
            </Flex>
          </Stepper.Completed>
        </Stepper>

        <Flex mt={16} gap={8} justify="space-between">
          <Button variant="default" onClick={prevStep} disabled={activeStep === 0}>
            Back
          </Button>
          <Button onClick={nextStep} disabled={activeStep > 2}>
            Next step
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};
export default EventApplicationModal;
