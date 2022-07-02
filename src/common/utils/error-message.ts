import { CoreOutput } from '../dto/core-output.dto';

export function NotFoundEntity(): CoreOutput {
  return {
    ok: false,
    error: 'Not Found',
  };
}

export function ResponseAndPrintError(e: string): CoreOutput {
  return {
    ok: false,
    error: e,
  };
}
