import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { environment } from '@environments/environment';
const baseUrl = `${environment.apiUrl}/accounts`;
let AccountService = class AccountService {
    router;
    http;
    accountSubject;
    account;
    constructor(router, http) {
        this.router = router;
        this.http = http;
        this.accountSubject = new BehaviorSubject(null);
        this.account = this.accountSubject.asObservable();
    }
    get accountValue() {
        return this.accountSubject.value;
    }
    login(email, password) {
        return this.http.post(`${baseUrl}/authenticate`, { email, password }, { withCredentials: true })
            .pipe(map(account => {
            this.accountSubject.next(account);
            this.startRefreshTokenTimer();
            return account;
        }));
    }
    logout() {
        this.http.post(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.accountSubject.next(null);
        this.router.navigate(['/account/login']);
    }
    refreshToken() {
        return this.http.post(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map(account => {
            this.accountSubject.next(account);
            this.startRefreshTokenTimer();
            return account;
        }));
    }
    register(account) {
        return this.http.post(`${baseUrl}/register`, account);
    }
    verifyEmail(token) {
        return this.http.post(`${baseUrl}/verify-email`, { token });
    }
    forgotPassword(email) {
        return this.http.post(`${baseUrl}/forgot-password`, { email });
    }
    validateResetToken(token) {
        return this.http.post(`${baseUrl}/validate-reset-token`, { token });
    }
    resetPassword(token, password, confirmPassword) {
        return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
    }
    getAll() {
        return this.http.get(baseUrl);
    }
    getById(id) {
        return this.http.get(`${baseUrl}/${id}`);
    }
    create(params) {
        return this.http.post(baseUrl, params);
    }
    update(id, params) {
        return this.http.put(`${baseUrl}/${id}`, params)
            .pipe(map((account) => {
            // update stored account if updating own account
            if (account.id === this.accountValue?.id) {
                account = { ...this.accountValue, ...account };
                this.accountSubject.next(account);
            }
            return account;
        }));
    }
    delete(id) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
            // auto logout if the logged in account was deleted
            if (id === this.accountValue?.id) {
                this.logout();
            }
        }));
    }
    // helper methods
    refreshTokenTimeout;
    startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtBase64 = this.accountValue.jwtToken.split('.')[1];
        const jwtToken = JSON.parse(atob(jwtBase64));
        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }
    stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
};
AccountService = __decorate([
    Injectable({ providedIn: 'root' })
], AccountService);
export { AccountService };
