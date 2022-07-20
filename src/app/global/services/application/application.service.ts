import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  updateDoc
} from '@angular/fire/firestore';

import { Collections } from '~enums/collections.enum';
import { ApplicationDoc, ApplicationOffer } from '~interfaces/application-doc.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ColumnsService } from '~services/columns/columns.service';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { UserStore } from '~store/user.store';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(
    private columnsService: ColumnsService,
    private firestore: Firestore,
    private jobBoardsService: JobBoardsService,
    private userStore: UserStore
  ) {}

  public async createApplication(columnId: string, application: ApplicationDoc): Promise<void> {
    await addDoc(
      collection(
        this.firestore,
        Collections.Users,
        this.userStore.uid!,
        Collections.JobBoards,
        this.userStore.currentJobBoard!,
        Collections.Columns,
        columnId,
        Collections.Applications
      ),
      application
    )
      .then(async () => {
        await this.columnsService.updateTotal(columnId, 1);
        await this.jobBoardsService.updateJobBoardTotal(this.userStore.currentJobBoard!, 1);
      })
      .catch((error) => {
        throw error;
      });
  }

  public async deleteApplication(columnId: string, applicationId: string): Promise<void> {
    await deleteDoc(this.getDocRef(columnId, applicationId))
      .then(async () => {
        await this.columnsService.updateTotal(columnId, -1);
        await this.jobBoardsService.updateJobBoardTotal(this.userStore.currentJobBoard!, -1);
      })
      .catch((error) => {
        throw error;
      });
  }

  public getDocRef(columnId: string, applicationId: string): DocumentReference<DocumentData> {
    return doc(
      this.firestore,
      Collections.Users,
      this.userStore.uid!,
      Collections.JobBoards,
      this.userStore.currentJobBoard!,
      Collections.Columns,
      columnId,
      Collections.Applications,
      applicationId
    );
  }

  public async moveApplication(prevColumnId: string, nextColumn: Column, application: Application): Promise<void> {
    const applicationDoc: ApplicationDoc = {
      columnDocId: nextColumn.docId,
      company: application.company,
      compensation: application.compensation,
      date: application.date,
      link: application.link,
      location: application.location,
      offer: application.offer,
      payPeriod: application.payPeriod,
      position: application.position
    };

    await this.createApplication(nextColumn.docId, applicationDoc)
      .then(async () => {
        await this.deleteApplication(prevColumnId, application.docId).catch((error) => {
          throw error;
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  public async updateApplication(columnId: string, applicationId: string, application: ApplicationDoc): Promise<void> {
    await updateDoc(this.getDocRef(columnId, applicationId), {
      company: application.company,
      compensation: application.compensation,
      date: application.date,
      link: application.link,
      location: application.location,
      payPeriod: application.payPeriod,
      position: application.position
    }).catch((error) => {
      throw error;
    });
  }

  public async updateApplicationOffer(columnId: string, applicationId: string, offer: ApplicationOffer): Promise<void> {
    await updateDoc(this.getDocRef(columnId, applicationId), { offer }).catch((error) => {
      throw error;
    });
  }
}
