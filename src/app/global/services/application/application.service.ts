import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { Updates } from '~enums/updates.enum';
import { ApplicationDoc } from '~interfaces/application-doc.interface';
import { Application } from '~models/application.model';
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

  public async moveApplication(prevColumnId: string, nextColumnId: string, application: Application): Promise<void> {
    this.isApplicationsLoading.next(true);

    const applicationDoc: ApplicationDoc = {
      company: application.company,
      date: application.date,
      link: application.link,
      location: application.location,
      position: application.position
    };

    await this.createApplication(nextColumnId, applicationDoc)
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
}
