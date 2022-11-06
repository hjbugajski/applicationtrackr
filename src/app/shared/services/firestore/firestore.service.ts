import { Inject, Injectable } from '@angular/core';
import {
  addDoc,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docSnapshots,
  DocumentData,
  DocumentReference,
  Firestore,
  FirestoreDataConverter,
  Query,
  UpdateData,
  updateDoc
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class FirestoreService<T> {
  protected abstract _basePath: string;
  protected abstract _collectionRef: CollectionReference<DocumentData>;
  protected abstract _collectionRefWithConverter: CollectionReference<T>;

  constructor(@Inject(Firestore) protected firestore: Firestore) {}

  public collection$(query: Query<T>): Observable<T[]> {
    return collectionData(query);
  }

  public async create(data: any): Promise<DocumentReference<T>> {
    return await addDoc(this.collectionRef, data);
  }

  public async delete(id: string): Promise<void> {
    return await deleteDoc(this.docRef(id));
  }

  public doc$(id: string, converter: FirestoreDataConverter<T>): Observable<T> {
    return docSnapshots(this.docRef(id).withConverter(converter)).pipe(map((doc) => doc.data() as T));
  }

  public docRef(id: string): DocumentReference<DocumentData> {
    return doc(this.firestore, this.basePath, id);
  }

  public async update(id: string, value: UpdateData<T>): Promise<void> {
    return await updateDoc(this.docRef(id) as DocumentReference<T>, value);
  }

  public get basePath(): string {
    return this._basePath;
  }

  public get collectionRef(): CollectionReference<DocumentData> {
    return this._collectionRef;
  }

  public get collectionRefWithConverter(): CollectionReference<T> {
    return this._collectionRefWithConverter;
  }
}
