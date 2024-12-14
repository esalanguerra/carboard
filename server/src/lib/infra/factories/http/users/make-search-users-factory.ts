import { Controller } from "@/common/controller/controller";
import { SearchUsersController } from "@/lib/api/controllers/users/search-users-controller";

export function makeSearchUsersFactory(): Controller {
  const searchUsersController = new SearchUsersController();
  return searchUsersController;
}
