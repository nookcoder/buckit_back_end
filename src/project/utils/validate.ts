import { DATE_PATTER, FORMAT_ERROR } from './constants';

function validateDeadlineStringFormat(deadline: string) {
  return DATE_PATTER.test(deadline);
}

export function createDateInstanceForDeadline(
  deadLine: any
): Date | typeof FORMAT_ERROR {
  if (validateDeadlineStringFormat(deadLine)) {
    return new Date(deadLine);
  }
  return false;
}
