import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpClient,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
  string | null
>(null);

const addTokenHeader = (req: HttpRequest<unknown>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const urlIsBackend = req.url.startsWith('http://localhost:3000');

  const sessionDataString = sessionStorage.getItem('accesstoken');
  let authReq = req;

  if (urlIsBackend && sessionDataString) {
    try {
      const sessionData = JSON.parse(sessionDataString);
      if (sessionData && sessionData.token) {
        authReq = addTokenHeader(req, sessionData.token);
      }
    } catch (error) {
      console.error('Error parsing session data in auth interceptor:', error);
    }
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if error is 401 Unauthorized and it's a backend request
      // We also prevent infinite loops if the refresh endpoint itself returns 401
      if (
        error.status === 401 &&
        urlIsBackend &&
        !req.url.includes('/api/auth/refresh')
      ) {
        return handle401Error(req, next, http);
      }
      return throwError(() => error);
    }),
  );
};

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  http: HttpClient,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const sessionDataString = sessionStorage.getItem('accesstoken');
    let refreshToken = '';
    let googleId = '';

    if (sessionDataString) {
      try {
        const sessionData = JSON.parse(sessionDataString);
        refreshToken = sessionData.refreshToken || ''; // Assuming refresh token is stored here
        googleId = sessionData.googleId || sessionData.id || '';
      } catch (error) {
        console.error('Error reading token data', error);
      }
    }

    // Call your refresh endpoint here
    return http
      .post<{ token: string; refreshToken?: string }>(
        'http://localhost:3000/api/auth/refresh',
        {
          token: refreshToken, // adjust payload based on your backend expectation
          googleId: googleId,
        },
      )
      .pipe(
        switchMap((response) => {
          isRefreshing = false;

          // Assuming response returns { token: 'NEW_TOKEN', refreshToken: 'NEW_REFRESH' }
          const newToken = response.token;

          // Update sessionStorage
          if (sessionDataString) {
            try {
              const currentData = JSON.parse(sessionDataString);
              const newData = {
                ...currentData,
                token: newToken,
                ...(response.refreshToken
                  ? { refreshToken: response.refreshToken }
                  : {}),
              };
              sessionStorage.setItem('accesstoken', JSON.stringify(newData));
            } catch (error) {
              console.error('Error stringifying new token data', error);
            }
          }

          refreshTokenSubject.next(newToken);
          return next(addTokenHeader(req, newToken));
        }),
        catchError((err) => {
          isRefreshing = false;
          // Refresh failed, usually implies to force logout the user.
          sessionStorage.removeItem('accesstoken');
          // router.navigate(['/login']) might be needed here depending on architecture
          return throwError(() => err);
        }),
      );
  } else {
    // If a refresh is already in progress, wait until the subject gets a new token
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        return next(addTokenHeader(req, token as string));
      }),
    );
  }
}
