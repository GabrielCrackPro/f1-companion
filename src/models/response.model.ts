export interface Response<T> {
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  series: string;
  data: T;
}
