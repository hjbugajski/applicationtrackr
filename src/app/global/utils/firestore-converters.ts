import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { JobBoard } from '~models/job-board.model';
import { UserData } from '~state/user-data/user-data.model';

const jobBoardConverter = {
  toFirestore: (board: JobBoard): JobBoard => {
    return board;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): JobBoard => {
    return new JobBoard(snapshot);
  }
};

const userDataConverter = {
  toFirestore: (user: UserData): UserData => {
    return user;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): UserData => {
    return new UserData(snapshot);
  }
};

export { jobBoardConverter, userDataConverter };
