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
import { BehaviorSubject } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { Updates } from '~enums/updates.enum';
import { ApplicationDoc } from '~interfaces/application-doc.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ColumnsService } from '~services/columns/columns.service';
import { UserDataQuery } from '~state/user-data/user-data.query';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  public isApplicationsLoading: BehaviorSubject<boolean>;

  constructor(
    private columnsService: ColumnsService,
    private firestore: Firestore,
    private userDataQuery: UserDataQuery
  ) {
    this.isApplicationsLoading = new BehaviorSubject<boolean>(false);
  }

  public async createApplication(columnId: string, application: ApplicationDoc): Promise<void> {
    await addDoc(
      collection(
        this.firestore,
        Collections.Users,
        this.userDataQuery.uid!,
        Collections.JobBoards,
        this.userDataQuery.currentJobBoard!.docId!,
        Collections.Columns,
        columnId,
        Collections.Applications
      ),
      application
    )
      .then(async () => {
        await this.columnsService.updateTotal(columnId, Updates.Add);
      })
      .catch((error) => {
        throw error;
      });
  }

  public async deleteApplication(columnId: string, applicationId: string): Promise<void> {
    const docRef = doc(
      this.firestore,
      Collections.Users,
      this.userDataQuery.uid!,
      Collections.JobBoards,
      this.userDataQuery.currentJobBoard!.docId!,
      Collections.Columns,
      columnId,
      Collections.Applications,
      applicationId
    );

    await deleteDoc(docRef)
      .then(async () => {
        await this.columnsService.updateTotal(columnId, Updates.Delete);
      })
      .catch((error) => {
        throw error;
      });
  }

  public getDocRef(columnId: string, applicationId: string): DocumentReference<DocumentData> {
    return doc(
      this.firestore,
      Collections.Users,
      this.userDataQuery.uid!,
      Collections.JobBoards,
      this.userDataQuery.currentJobBoard!.docId!,
      Collections.Columns,
      columnId,
      Collections.Applications,
      applicationId
    );
  }

  public async moveApplication(prevColumnId: string, nextColumn: Column, application: Application): Promise<void> {
    this.isApplicationsLoading.next(true);

    const applicationDoc: ApplicationDoc = {
      columnDocId: nextColumn.docId,
      company: application.company,
      compensation: application.compensation ?? null,
      date: application.date,
      link: application.link ?? null,
      location: application.location ?? null,
      payPeriod: application.payPeriod ?? null,
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

    this.isApplicationsLoading.next(false);
  }

  public async updateApplication(columnId: string, applicationId: string, application: ApplicationDoc): Promise<void> {
    await updateDoc(this.getDocRef(columnId, applicationId), {
      company: application.company,
      compensation: application.compensation ?? null,
      date: application.date,
      link: application.link ?? null,
      location: application.location ?? null,
      payPeriod: application.payPeriod ?? null,
      position: application.position
    }).catch((error) => {
      throw error;
    });
  }
}