export interface CustomerInterfaceResponse {
  id: string;
  name: string;
  vat: string;
  phone_number: string;
  user_id: string;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomerInterface extends CustomerInterfaceResponse {}
