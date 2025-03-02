import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";

const useStepper = <Form extends UseFormReturnType<any>>(form?: Form) => {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => {
    if (form) {
      form.validate();
      if (!form.isValid()) return;
    }
    setActiveStep((current) => (current < 3 ? current + 1 : current));
  };
  const prevStep = () => {
    setActiveStep((current) => (current > 0 ? current - 1 : current));
  };

  return {
    activeStep,
    setActiveStep,
    nextStep,
    prevStep,
  };
};

export default useStepper;
