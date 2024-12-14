import type { Event } from "../controller/controller";

export const adaptEvent = (event: Event) => {
  return async (data: any) => {
    await event.execute(data);
  };
};
