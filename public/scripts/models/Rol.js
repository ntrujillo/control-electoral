(function (angular) {
    angular.module('ControlElectoralApp').factory('Rol', function () {
            function Rol(options) {
                if (angular.isDefined(options._id)) {
                    this._id = options._id;
                }
                if (angular.isDefined(options.ro_rol)) {
                    this.ro_rol = options.ro_rol;
                }
                if (angular.isDefined(options.ro_description)) {
                    this.ro_description = options.ro_description;
                }
                if (angular.isDefined(options.ro_status)) {
                    if (options.ro_status === 'V') {
                        this.ro_status = 'Vigente';
                    } else {
                        this.ro_status = 'No Vigente';
                    }
                }
                if (angular.isDefined(options.ro_created)) {
                    this.ro_created = options.ro_created;
                }
            }

            Rol.prototype.properties = function () {
                var that = this;
                return {
                    get _id() {
                        return that._id;
                    },
                    get ro_rol() {
                        return that.ro_rol;
                    },
                    get ro_description() {
                        return that.ro_description;
                    },
                    set ro_description(description) {
                        that.ro_description = description;
                    },
                    get status() {
                        if (that.ro_created === 'V') {
                            return 'Vigente'
                        } else {
                            return 'No Vigente'
                        }
                    },
                    set status(status) {
                        that.status = status;
                    }
                }
            };
            return Rol;
        }
    );
}(window.angular));