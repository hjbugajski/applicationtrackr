import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { JobBoard } from '~models/job-board.model';
import { User } from '~models/user.model';

export const applicationConverter = {
  toFirestore: (application: Application): DocumentData => {
    return {
      columnDocId: application.columnDocId,
      company: application.company,
      compensation: application.compensation,
      date: application.date,
      link: application.link,
      location: application.location,
      offer: application.offer,
      payPeriod: application.payPeriod,
      position: application.position
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Application => {
    return new Application(snapshot);
  }
};

export const columnConverter = {
  toFirestore: (column: Column): DocumentData => {
    return {
      applicationSort: column.applicationSort,
      color: column.color,
      sortOrder: column.sortOrder,
      title: column.title,
      total: column.total
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Column => {
    return new Column(snapshot);
  }
};

export const jobBoardConverter = {
  toFirestore: (jobBoard: JobBoard): DocumentData => {
    return {
      date: jobBoard.date,
      title: jobBoard.title,
      total: jobBoard.total
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): JobBoard => {
    return new JobBoard(snapshot);
  }
};

export const userConverter = {
  toFirestore: (user: User): DocumentData => {
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
