import { GetUserDataController } from "@/lib/api/controllers/users/get-user-data-controller";
import {Controller} from "@/common/controller/controller";

export function makeGetUserDataFactory(): Controller {
  const getUserDataController = new GetUserDataController();
  return getUserDataController;
}
