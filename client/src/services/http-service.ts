import { tokenStorage } from '../lib/token-storage';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export class UnauthorisedError extends Error {}

export class InputError extends HttpError {
  constructor(
    status: number,
    message: string,
    public readonly formErrors: string[],
    public readonly fieldErrors: Record<string, string[] | undefined>,
  ) {
    super(status, message);
  }
}

export interface RequestOptions {
  query?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: Record<string, any>;
}

export class HttpService {
  private async request(
    method: string,
    path: string,
    { body, query }: RequestOptions,
  ) {
    const authToken = tokenStorage.token;
    const queryString = new URLSearchParams(query).toString();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/${path.replace(
        /^\//,
        '',
      )}?${queryString}`,
      {
        method,
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: body && JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const statusCode = response.status;
      const body = this.tryToParseAsJson(await response.text());
      const message = body?.message ?? 'Error in HTTP request';

      if (statusCode === 400 && body.fieldErrors && body.formErrors) {
        throw new InputError(
          statusCode,
          message,
          body.formErrors,
          body.fieldErrors,
        );
      }

      if (statusCode === 401) {
        tokenStorage.removeToken();
        throw new UnauthorisedError();
      }

      throw new HttpError(statusCode, message);
    }

    return response.json();
  }

  async get<T>(path: string, { query }: RequestOptions): Promise<T> {
    return this.request('GET', path, { query });
  }

  async post<T>(path: string, options: RequestOptions): Promise<T> {
    return this.request('POST', path, options);
  }

  async patch<T>(path: string, options: RequestOptions): Promise<T> {
    return this.request('PATCH', path, options);
  }

  async put<T>(path: string, options: RequestOptions): Promise<T> {
    return this.request('PUT', path, options);
  }

  async delete<T>(path: string, options: RequestOptions): Promise<T> {
    return this.request('DELETE', path, options);
  }

  private tryToParseAsJson(text: string) {
    try {
      return JSON.parse(text);
    } catch (error) {
      /* empty */
    }
  }
}
