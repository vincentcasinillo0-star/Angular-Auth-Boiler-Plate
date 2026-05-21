export class Alert {
    id;
    type;
    message;
    autoClose;
    keepAfterRouteChange;
    fade;
    constructor(init) {
        Object.assign(this, init);
    }
}
export var AlertType;
(function (AlertType) {
    AlertType[AlertType["Success"] = 0] = "Success";
    AlertType[AlertType["Error"] = 1] = "Error";
    AlertType[AlertType["Info"] = 2] = "Info";
    AlertType[AlertType["Warning"] = 3] = "Warning";
})(AlertType || (AlertType = {}));
export class AlertOptions {
    id;
    autoClose;
    keepAfterRouteChange;
}
