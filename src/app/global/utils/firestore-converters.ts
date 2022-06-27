import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { Column } from '~models/column.model';
import { JobBoard } from '~models/job-board.model';
import { UserData } from '~state/user-data/user-data.model';

const columnConverter = {
  toFirestore: (column: Column): Column => {
    return column;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Column => {
    return new Column(snapshot);
  }
};

const jobBoardConverter = {
  toFirestore: (board: JobBoard): JobBoard => {
    return board;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): JobBoard => {
    return new JobBoard(snapshot);
  }
};

const userDataConverter = {
  toFirestore: (user: UserData) => {
    return {
      currentJobBoard: user.currentJobBoard
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): UserData => {
    return new UserData(snapshot);
  }
};

export { columnConverter, jobBoardConverter, userDataConverter };
