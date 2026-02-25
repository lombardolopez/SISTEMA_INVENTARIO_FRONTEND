import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.navigate(['/auth/login']);
          break;
        case 403:
          console.warn('Acceso denegado');
          break;
        case 0:
          console.error('No se puede conectar con el servidor');
          break;
      }

      const message = error.error?.message ?? 'Error inesperado';
      return throwError(() => ({ status: error.status, message }));
    }),
  );
};
