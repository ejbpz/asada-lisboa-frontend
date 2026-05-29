export interface ErrorDetail {
  code: string;
  description: string;
}

export class AppError extends Error {
  status?: number;

  type?: string;
  title?: string;
  detail?: string;

  errors?: ErrorDetail[];

  isAuthError?: boolean;
  isNetworkError?: boolean;

  constructor(init?: Partial<AppError>) {
    super(init?.message ?? 'Unknown error');

    this.name = 'AppError';

    Object.assign(this, init);
  }
}
