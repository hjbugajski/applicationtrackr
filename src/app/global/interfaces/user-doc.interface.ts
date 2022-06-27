import { JobBoard } from '~models/job-board.model';

export interface UserDoc {
  currentJobBoard: JobBoard | null;
}
