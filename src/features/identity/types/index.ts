export interface GuestIdentity {
  identity_id: string;
  guest_token: string;
}

export interface GuestIdentityResponse {
  data: GuestIdentity;
}
