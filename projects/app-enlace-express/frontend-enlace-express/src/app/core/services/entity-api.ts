import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export abstract class EntityApi<T, CreatePayload, UpdatePayload = Partial<CreatePayload>, ReplacePayload = CreatePayload> {
  protected readonly http = inject(HttpClient);

  protected constructor(
    protected readonly base: string,
    private readonly collectionKey: string,
    private readonly entityKey: string,
  ) {}

  list(params?: HttpParams): Observable<T[]> {
    return this.http
      .get<Record<string, T[]>>(this.base, { params })
      .pipe(map((response) => response[this.collectionKey]));
  }

  get(id: number): Observable<T> {
    return this.http
      .get<Record<string, T>>(`${this.base}/${id}`)
      .pipe(map((response) => response[this.entityKey]));
  }

  create(payload: CreatePayload): Observable<T> {
    return this.http
      .post<Record<string, T>>(this.base, payload)
      .pipe(map((response) => response[this.entityKey]));
  }

  update(id: number, payload: UpdatePayload): Observable<T> {
    return this.http
      .patch<Record<string, T>>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response[this.entityKey]));
  }

  replace(id: number, payload: ReplacePayload): Observable<T> {
    return this.http
      .put<Record<string, T>>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response[this.entityKey]));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}