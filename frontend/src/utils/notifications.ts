import { ErrorType } from "@/utils/customInstance";
import { notifications } from "@mantine/notifications";

export const showErrorNotification = (errorResponse: ErrorType<void>) => {
  // @ts-ignore
  const { message, error, statusCode } = errorResponse.response?.data;

  if (!message) return null;

  if (typeof message === "string") {
    notifications.show({
      title: `${statusCode} - ${error}`,
      message: message,
      color: "red",
    });
  } else {
    message.forEach((err: string) => {
      notifications.show({
        title: `${statusCode} - ${error}`,
        message: err,
        color: "red",
      });
    });
  }
};

export const updateErrorNotification = (id: string) => {
  notifications.update({
    id,
    title: "Something went wrong.",
    message: "Please check all information first. Then try again.",
    color: "red",
    loading: false,
    autoClose: true,
  });
};
