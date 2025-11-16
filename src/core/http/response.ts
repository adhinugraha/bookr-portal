export const response = (data: any, message = "Success", success = true) => ({
  success,
  message,
  data,
});
