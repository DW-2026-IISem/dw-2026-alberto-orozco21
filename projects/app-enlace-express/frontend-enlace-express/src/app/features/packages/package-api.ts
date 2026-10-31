import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Package, PackagePayload } from '../../core/models/package.model';

/** /packages — la lista llega en `{ packages }` y el detalle en `{ package }`. */
@Injectable({ providedIn: 'root' })
export class PackageApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/packages`;

  list(): Observable<Package[]> {
    return this.http
      .get<{ packages: Package[] }>(this.base)
      .pipe(map((response) => response.packages));
  }

  get(id: number): Observable<Package> {
    return this.http
      .get<{ package: Package }>(`${this.base}/${id}`)
      .pipe(map((response) => response.package));
  }

  create(payload: PackagePayload): Observable<Package> {
    return this.http
      .post<{ package: Package }>(this.base, payload)
      .pipe(map((response) => response.package));
  }

  update(id: number, payload: Partial<PackagePayload>): Observable<Package> {
    return this.http
      .patch<{ package: Package }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.package));
  }

  replace(id: number, payload: PackagePayload): Observable<Package> {
    return this.http
      .put<{ package: Package }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.package));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
