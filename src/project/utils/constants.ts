export const DATE_PATTER = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})$/;
export const FORMAT_ERROR = false;

export const UPLOAD_FIELDS = [
  {
    name: 'thumbnail',
    maxCount: 1,
  },
  {
    name: 'content',
    maxCount: 10,
  },
];

export enum OrderBy {
  CREATED_AT,
  DEAD_LINE,
  LIKE,
}
