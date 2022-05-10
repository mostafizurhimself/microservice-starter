import * as core from 'express-serve-static-core';

export interface AnyObject {
  [k: string]: any;
}

// Mongoose search criteria
export interface Criteria {
  [propName: string]: any;
}

// Paginated express query
export type PaginatedQuery = {
  page?: number;
  limit?: number;
  withoutPagination?: boolean;
} & core.Query;

// Paginated result
export interface PaginatedResult<T> {
  data: Array<T>;
  meta: {
    totalPage: number;
    current: number;
    totalItem: number;
    perPage: number;
  };
}

// Api response type
export interface ApiResponse {
  // Response message
  message?: string;
  // Requested data
  data?: any;
  // Validation error messages
  errors?: any;
  // Additional meta data
  meta?: AnyObject;
}
