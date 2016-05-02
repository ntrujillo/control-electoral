(function (angular) {
    angular.module('ControlElectoralApp').factory('User', function () {
            function User(options) {
                if (angular.isDefined(options._id)) {
                    this._id = options._id;
                }
                if (angular.isDefined(options.firstName)) {
                    this.firstName = options.firstName;
                }
                if (angular.isDefined(options.lastName)) {
                    this.lastName = options.lastName;
                }
                if (angular.isDefined(options.email)) {
                    this.email = options.email;
                }
                if (angular.isDefined(options.status)) {
                    if (options.status === 'V') {
                        this.status = 'Vigente';
                    } else {
                        this.status = 'Bloqueado';
                    }
                }
                if (angular.isDefined(options.created)) {
                    this.created = options.created;
                }
                if (angular.isDefined(options.document)) {
                    this.document = options.document;
                }
            }

            User.prototype.properties = function () {
                var that = this;
                return {
                    get id() {
                        return that.id;
                    },
                    get firstName() {
                        return that.firstName;
                    },
                    get lastName() {
                        return that.lastName;
                    },
                    get email() {
                        return that.email;
                    },
                    set email(email) {
                        that.email = email;
                    },
                    get status() {
                        if (that.status === 'V') {
                            return 'Vigente'
                        } else {
                            return 'Bloqueado'
                        }
                    },
                    set status(status) {
                        that.status = status;
                    },
                    get created() {
                        return that.created;
                    },
                    set created(created) {
                        that.created = created;
                    }
                }
            };
            return User;
        }
    );
}(window.angular));