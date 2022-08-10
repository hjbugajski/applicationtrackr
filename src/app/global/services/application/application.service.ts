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
    await deleteDoc(this.getDocRef(applicationId))
      .then(async () => {
        await this.columnsService.updateTotal(columnId, -1);
        await this.jobBoardsService.updateJobBoardTotal(this.userStore.currentJobBoard!, -1);
      })
      .catch((error) => {
        throw error;
      });
  }

  public getDocRef(applicationId: string): DocumentReference<DocumentData> {
    return doc(
      this.firestore,
      Collections.Users,
      this.userStore.uid!,
      Collections.JobBoards,
      this.userStore.currentJobBoard!,
      Collections.Applications,
      applicationId
    );
  }

  public async moveApplication(prevColumnId: string, nextColumn: Column, application: Application): Promise<void> {
    await updateDoc(this.getDocRef(application.docId), { columnDocId: nextColumn.docId })
      .then(async () => {
        await this.columnsService.updateTotal(prevColumnId, -1);
        await this.columnsService.updateTotal(nextColumn.docId, 1);
      })
      .catch((error) => {
        throw error;
      });
  }

  public async updateApplication(applicationId: string, application: ApplicationDoc): Promise<void> {
    await updateDoc(this.getDocRef(applicationId), {
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

  public async updateApplicationOffer(applicationId: string, offer: ApplicationOffer): Promise<void> {
    await updateDoc(this.getDocRef(applicationId), { offer }).catch((error) => {
      throw error;
    });
  }
}
