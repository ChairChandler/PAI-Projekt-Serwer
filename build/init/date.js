"use strict";
Date.prototype["getOnlyDate"] = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};
