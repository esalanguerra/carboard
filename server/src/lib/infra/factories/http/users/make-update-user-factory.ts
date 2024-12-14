import { Controller } from "@/common/controller/controller";
import { UpdateUserDataController } from "@/lib/api/controllers/users/update-user-data-controller";

export function makeUpdateUserDataFactory(): Controller {
  const updateUserDataController = new UpdateUserDataController();
  return updateUserDataController;
}
