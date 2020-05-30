Date.prototype["getOnlyDate"] = function() {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate())
}

interface Date {
    getOnlyDate(): Date;
}