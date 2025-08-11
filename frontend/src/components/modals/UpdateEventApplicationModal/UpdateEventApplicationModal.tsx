import { useGetCurrentUser, useUpdateEventApplication, useUserOrganizationMemberships } from "@/utils/api";
import {
  CreateEventApplicationInvoiceMethod,
  EventApplicationDetailedWithApplications,
  Organization,
  UpdateEventApplication,
} from "@/utils/api.schemas";
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
  Flex,
  Grid,
  Group,
  Modal,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import dayjs from "dayjs";
import React, { useState } from "react";

interface UpdateEventModalProps {
  currentApplication: EventApplicationDetailedWithApplications;
  isOpened: boolean;
  closeModal: () => void;
  handleSuccess?: () => void;
}

const UpdateEventApplicationModal = ({
  currentApplication,
  isOpened,
  closeModal,
  handleSuccess = () => {},
}: UpdateEventModalProps) => {
  const foodRestrictionsData = Object.entries(allergenData).map(([key]) => key);
  const applicationFoodRestriction = currentApplication.foodRestrictionAllergies.split(", ");

  const [foodRestrictionList, setFoodRestrictionList] = useState<string[]>(
    foodRestrictionsData.filter((item) => {
      return applicationFoodRestriction.includes(item);
    }),
  );
  const [otherFoodRestrictionList, setOtherFoodRestrictionList] = useState<string>(
    applicationFoodRestriction
      .filter((item) => {
        return !foodRestrictionsData.includes(item);
      })
      .join(", "),
  );

  const [healthLimitationsList, setHealthLimitationsList] = useState<string[]>(
    currentApplication.healthLimitations.split(", ").filter((item) => {
      return healthLimitationsData.includes(item);
    }),
  );
  const [otherHealthLimitationsList, setOtherHealthLimitationsList] = useState<string>(
    currentApplication.healthLimitations
      .split(", ")
      .filter((item) => {
        return !healthLimitationsData.includes(item);
      })
      .join(", "),
  );

  const [selectedOrganisation, setSelectedOrganisation] = useState<Organization | null>(
    currentApplication.organization,
  );
  const { data: currentUser } = useGetCurrentUser();

  const { data: userOrganisationMemberships } = useUserOrganizationMemberships(currentApplication.user.id);

  const form = useForm<UpdateEventApplication>({
    initialValues: {
      idNumber: currentApplication.idNumber,
      validUntil: currentApplication.validUntil,
      invoiceMethod: currentApplication.invoiceMethod,
      organization:
        currentApplication.customOrganization === null
          ? {
              type: "organization",
              id: currentApplication.organization.id,
            }
          : {
              type: "custom",
              id: currentApplication.customOrganization.id,
              name: currentApplication.customOrganization.name,
              country: currentApplication.customOrganization.country,
            },
      foodRestrictionAllergies: currentApplication.foodRestrictionAllergies,
      healthLimitations: currentApplication.healthLimitations,
      additionalInformation: currentApplication.additionalInformation,
      invoicedTo: currentApplication.invoicedTo,
    },
    validate: {},
    transformValues: (values) => {
      const { foodRestrictionAllergies, healthLimitations, ...restValues } = values;

      return {
        ...restValues,
        foodRestrictionAllergies:
          foodRestrictionList.length > 0
            ? `${foodRestrictionList.sort().join(", ")}${foodRestrictionList.includes("Other") ? `, ${otherFoodRestrictionList}` : ""}`
            : otherFoodRestrictionList,
        healthLimitations:
          healthLimitationsList.length > 0
            ? `${healthLimitationsList.sort().join(", ")}${healthLimitationsList.includes("Other") ? `, ${otherHealthLimitationsList}` : ""}`
            : otherHealthLimitationsList,
      };
    },
  });

  const isTouchedDirty = form.isTouched() && form.isDirty();

  const updateEventApplication = useUpdateEventApplication({
    mutation: {
      onSuccess: () => {
        handleSuccess();
        closeModal();
      },
    },
  });

  const handleSubmit = (data: UpdateEventApplication) => {
    console.log(form.values);
    console.log(data);
    updateEventApplication.mutate({
      id: currentApplication.id,
      data: data,
    });
  };

  const handleCloseModal = () => {
    setFoodRestrictionList(
      foodRestrictionsData.filter((item) => {
        return applicationFoodRestriction.includes(item);
      }),
    );
    setOtherFoodRestrictionList(
      applicationFoodRestriction
        .filter((item) => {
          return !foodRestrictionsData.includes(item);
        })
        .join(", "),
    );

    setHealthLimitationsList(
      currentApplication.healthLimitations.split(", ").filter((item) => {
        return healthLimitationsData.includes(item);
      }),
    );
    setOtherHealthLimitationsList(
      currentApplication.healthLimitations
        .split(", ")
        .filter((item) => {
          return !healthLimitationsData.includes(item);
        })
        .join(", "),
    );
    form.reset();
    closeModal();
  };

  if (!userOrganisationMemberships || !currentUser) {
    return null;
  }

  return (
    <Modal size="xl" opened={isOpened} onClose={handleCloseModal} title="Update Event Applicaton">
      <Form form={form} onSubmit={handleSubmit}>
        <Stack gap="md">
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
                    <TextInput label="Organisation Country" {...form.getInputProps("organization.country")} required />
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
          <Flex direction="column" gap="md">
            <Select
              label="Invoice Method"
              value={form.values.invoiceMethod}
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
            {form.values.invoiceMethod && (
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
                  }[form.values.invoiceMethod]
                }
              </Box>
            )}
          </Flex>
          <Flex direction="column" gap="md">
            <MultiSelect
              label="Food Restrictions and allergies"
              data={Object.entries(allergenData).map(([key]) => key)}
              renderOption={renderMultiSelectOption}
              defaultValue={foodRestrictionsData.filter((item) => {
                return applicationFoodRestriction.includes(item);
              })}
              onChange={(value) => {
                setFoodRestrictionList(value);
                form.setDirty({ foodRestrictionAllergies: true });
                form.setTouched({ foodRestrictionAllergies: true });
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
                value={otherFoodRestrictionList}
                onChange={(value) => {
                  setOtherFoodRestrictionList(value.currentTarget.value);
                  form.setDirty({ foodRestrictionAllergies: true });
                  form.setTouched({ foodRestrictionAllergies: true });
                }}
                autosize
              />
            )}
            <MultiSelect
              label="Disability or Health Limitations"
              data={healthLimitationsData}
              defaultValue={healthLimitationsList}
              onChange={(value) => {
                setHealthLimitationsList(value);
                form.setDirty({ healthLimitations: true });
                form.setTouched({ healthLimitations: true });
              }}
            />
            {healthLimitationsList.includes("Other") && (
              <Textarea
                label="Disability or Health Limitations (Other)"
                value={otherHealthLimitationsList}
                onChange={(value) => {
                  setOtherHealthLimitationsList(value.currentTarget.value);
                  form.setDirty({ healthLimitations: true });
                  form.setTouched({ healthLimitations: true });
                }}
                autosize
              />
            )}
            <Textarea label="Additional Information" {...form.getInputProps("additionalInformation")} autosize />
          </Flex>
        </Stack>
        <Group justify="center" mt="lg">
          <Button type="submit" disabled={!isTouchedDirty} loading={updateEventApplication.isPending}>
            Update Application
          </Button>
        </Group>
      </Form>
    </Modal>
  );
};
export default UpdateEventApplicationModal;
