import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { JobBoard } from '~models/job-board.model';
import { User } from '~models/user.model';

export const applicationConverter = {
  toFirestore: (application: Application): Application => {
    return application;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Application => {
    return new Application(snapshot);
  }
};

export const columnConverter = {
  toFirestore: (column: Column): Column => {
    return column;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Column => {
    return new Column(snapshot);
  }
};

export const jobBoardConverter = {
  toFirestore: (board: JobBoard): JobBoard => {
    return board;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): JobBoard => {
    return new JobBoard(snapshot);
  }
};

export const userDataConverter = {
  toFirestore: (user: User) => {
    return {
      currentJobBoard: user.currentJobBoard,
      settings: {
        appearance: user.settings?.appearance,
        collapseColumns: user.settings?.collapseColumns
      }
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): User => {
    return new User(snapshot);
  }
};
