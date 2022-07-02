import { DATE_PATTER } from './constants';

export function validateDeadlineStringFormat(deadline: string) {
  return DATE_PATTER.test(deadline);
}
