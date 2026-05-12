export interface ErrorDetail {
  code: string;
  description: string;
}

export interface AppError {
  message: string;

  status?: number | undefined;

  type?: string | undefined;
  title?: string | undefined;
  detail?: string | undefined;

  errors?: ErrorDetail[] | undefined;

  isAuthError?: boolean | undefined;
  isNetworkError?: boolean | undefined;
}
