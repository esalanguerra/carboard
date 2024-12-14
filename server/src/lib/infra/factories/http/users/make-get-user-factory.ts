import { Controller } from "@/common/controller/controller";
import { GetUserController } from "@/lib/api/controllers/users/get-user-controller";

export function makeGetUserFactory(): Controller {
  const getUserController = new GetUserController();
  return getUserController;
}
