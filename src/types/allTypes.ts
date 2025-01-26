import { ReactNode } from "react";

export type PublicHeaderDataTypes = { name: string; path: string };

export type PrivateHeaderDataTypes = {
  name: string;
  path: string;
  roleFor: string;
  Icon: ReactNode;
};

export type AuthUser = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string | null;
  phone: string;
  confirmation_sent_at: string | null;
  confirmed_at: string | null;
  last_sign_in_at: string | null;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    displayName: string;
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    role: string;
    sub: string;
  };
  identities?: Array<{
    id: string;
    user_id: string;
    provider: string;
    created_at: string;
    last_sign_in_at: string;
    updated_at: string;
  }>;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
};

export type PaymentType = {
  _id: string;
  title: string;
  amount: number;
  status: string;
  user_id: string;
  created_at: string;
  __v: number;
};

export type DocumentType = {
  _id: string;
  title: string;
  file_url: string;
  status: string;
  user_id: string;
  uploaded_at: string;
  __v: number;
};

export type NotificationType = {
  _id: string;
  status: string;
  user_id: string;
  message: string;
  created_at: string;
  role: string;
  __v: number;
};
