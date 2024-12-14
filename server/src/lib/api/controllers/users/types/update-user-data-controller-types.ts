export type UpdateUserDataControllerRequest = {
  full_name?: string;
  status?: "ACTIVE" | "DISABLED";
  user: { id: string };
};
