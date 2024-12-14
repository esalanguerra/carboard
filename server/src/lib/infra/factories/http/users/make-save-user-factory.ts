import { Controller } from "@/common/controller/controller";
import { SaveUserController } from "@/lib/api/controllers/users/save-user-controller";

export function makeSaveUserFactory(): Controller {
  const saveUsersController = new SaveUserController();
  return saveUsersController;
}
