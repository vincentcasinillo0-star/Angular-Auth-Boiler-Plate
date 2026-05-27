import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

const accountsKey = 'angular-19-boilerplate-accounts';
let accounts: any[] = JSON.parse(localStorage.getItem(accountsKey)!) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/accounts/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/accounts/refresh-token') && method === 'POST':
                    return refreshToken();
                case url.endsWith('/accounts/revoke-token') && method === 'POST':
                    return revokeToken();
                case url.endsWith('/accounts/register') && method === 'POST':
                    return register();
                case url.endsWith('/accounts/verify-email') && method === 'POST':
                    return verifyEmail();
                case url.endsWith('/accounts/forgot-password') && method === 'POST':
                    return forgotPassword();
                case url.endsWith('/accounts/validate-reset-token') && method === 'POST':
                    return validateResetToken();
                case url.endsWith('/accounts/reset-password') && method === 'POST':
                    return resetPassword();
                case url.endsWith('/accounts') && method === 'GET':
                    return getAccounts();
                case url.match(/\/accounts\/\d+$/) && method === 'GET':
                    return getAccountById();
                case url.match(/\/accounts\/\d+$/) && method === 'PUT':
                    return updateAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
                    return deleteAccount();
                default:
                    return next.handle(request);
            }
        }

        function authenticate() {
            const { email, password } = body;
            const account = accounts.find(x => x.email === email && x.password === password && x.isVerified);
            if (!account) return error('Email or password is incorrect');
            account.refreshTokens = account.refreshTokens || [];
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }

        function refreshToken() {
            const refreshToken = getRefreshToken();
            if (!refreshToken) return unauthorized();
            const account = accounts.find(x => x.refreshTokens?.includes(refreshToken));
            if (!account) return unauthorized();
            account.refreshTokens = account.refreshTokens.filter((x: string) => x !== refreshToken);
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }

        function revokeToken() {
            if (!isLoggedIn()) return unauthorized();
            const refreshToken = getRefreshToken();
            const account = accounts.find(x => x.refreshTokens?.includes(refreshToken));
            if (account) {
                account.refreshTokens = account.refreshTokens.filter((x: string) => x !== refreshToken);
                localStorage.setItem(accountsKey, JSON.stringify(accounts));
            }
            return ok({});
        }

        function register() {
            const account = body;
            if (accounts.find(x => x.email === account.email)) {
                setTimeout(() => alertMessage(`
                    <h4>Email Already Registered</h4>
                    <p>Your email <strong>${account.email}</strong> is already registered.</p>
                `), 1000);
                return ok({});
            }
            account.id = newAccountId();
            if (account.id === 1) {
                account.role = 'Admin';
            } else {
                account.role = 'User';
            }
            account.dateCreated = new Date().toISOString();
            account.verificationToken = new Date().getTime().toString();
            account.isVerified = false;
            account.refreshTokens = [];
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            setTimeout(() => alertMessage(`
                <h4>Verification Email</h4>
                <p>Thanks for registering!</p>
                <p>Please click the link below to verify your email:</p>
                <p><a href="${location.origin}/account/verify-email?token=${account.verificationToken}">Click here to verify</a></p>
            `), 1000);
            return ok({});
        }

        function verifyEmail() {
            const { token } = body;
            const account = accounts.find(x => x.verificationToken === token);
            if (!account) return error('Verification failed');
            account.isVerified = true;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok({});
        }

        function forgotPassword() {
            const { email } = body;
            const account = accounts.find(x => x.email === email);
            if (!account) return ok({});
            account.resetToken = new Date().getTime().toString();
            account.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            setTimeout(() => alertMessage(`
                <h4>Password Reset Email</h4>
                <p>Please click the link below to reset your password:</p>
                <p><a href="${location.origin}/account/reset-password?token=${account.resetToken}">Click here to reset</a></p>
            `), 1000);
            return ok({});
        }

        function validateResetToken() {
            const { token } = body;
            const account = accounts.find(x => x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires));
            if (!account) return error('Invalid token');
            return ok({});
        }

        function resetPassword() {
            const { token, password } = body;
            const account = accounts.find(x => x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires));
            if (!account) return error('Invalid token');
            account.password = password;
            account.isVerified = true;
            account.resetToken = undefined;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok({});
        }

        function getAccounts() {
            if (!isLoggedIn()) return unauthorized();
            return ok(accounts.map(x => basicDetails(x)));
        }

        function getAccountById() {
            if (!isLoggedIn()) return unauthorized();
            const account = accounts.find(x => x.id === idFromUrl());
            return ok(basicDetails(account));
        }

        function updateAccount() {
            if (!isLoggedIn()) return unauthorized();
            let params = body;
            let account = accounts.find(x => x.id === idFromUrl());
            if (!params.password) {
                delete params.password;
            }
            Object.assign(account, params);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok(basicDetails(account));
        }

        function deleteAccount() {
            if (!isLoggedIn()) return unauthorized();
            accounts = accounts.filter(x => x.id !== idFromUrl());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok({});
        }

        function ok(body: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500));
        }

        function error(message: string) {
            return throwError(() => ({ error: { message } }))
                .pipe(materialize(), delay(500), dematerialize());
        }

        function unauthorized() {
            return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }))
                .pipe(materialize(), delay(500), dematerialize());
        }

        function isLoggedIn() {
            return !!headers.get('Authorization');
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function newAccountId() {
            return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
        }

        function getRefreshToken() {
            return document.cookie.split(';').find(x => x.includes('fakeRefreshToken'))?.split('=')[1];
        }

        function generateJwtToken(account: any) {
            const tokenPayload = {
                exp: Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000),
                id: account.id
            };
            return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
        }

        function generateRefreshToken() {
            const token = new Date().getTime().toString();
            document.cookie = `fakeRefreshToken=${token}; path=/`;
            return token;
        }

        function basicDetails(account: any) {
            const { id, title, firstName, lastName, email, role, dateCreated, isVerified } = account;
            return { id, title, firstName, lastName, email, role, dateCreated, isVerified };
        }

        function alertMessage(message: string) {
            const alertEl = document.createElement('div');
            alertEl.innerHTML = `
                <div style="position:fixed;top:20px;right:20px;z-index:9999;background:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);max-width:400px;">
                    ${message}
                    <br><button onclick="this.parentElement.parentElement.remove()" style="margin-top:10px;padding:5px 15px;background:#5c67f2;color:#fff;border:none;border-radius:4px;cursor:pointer;">Close</button>
                </div>`;
            document.body.appendChild(alertEl);
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};