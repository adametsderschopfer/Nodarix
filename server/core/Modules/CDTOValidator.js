/**
 * Created by: Adamets Vladislav
 * Version: 0.1.3
 *
 * Example
 *
 * { type, required } <- is important fields
 *
 * class userEntityDTO {
 *      firstname = { required: true, type: String }
 *      lastname = { required: false, type: String }
 *      birthYear = { required: true, type: Number }
 *      birthDay = { type: [Number, String], required: true }
 *      someDepthFields = {
 *          required: true,
 *          type: Object,
 *          someDepthFields: {
 *              type: Object,
 *              required: true,
 *              someDepthField: { type: [Number, String], required: true },
 *              moreDepthField: {
 *                  type: Object,
 *                  required: true,
 *                  key: {
 *                      type: Boolean,
 *                      required: true
 *                  }
 *              }
 *          }
 *      }
 *  }
 *
 *  const userEntity = (
 *  { firstname: 'John', lastname: 'Doe', birthYear: 1999, birthDay: '16', someDepthFields: { someDepthFields: { moreDepthField: { key: true } , someDepthField: 1 }, } }
 *  );
 *  
 *  const userDTO = new Core.CDTOValidator(userEntity, userEntityDTO);
 * */

/**
 * @namespace Core
 * @class CDTOValidator
 * */
class CDTOValidator {
    value = undefined;
    DTO = undefined;
    valid = false;

    constructor(value, DTO) {
        if (!value) {
            throw CDTOValidator.Exception(`{ value } can't be undefined`);
        }

        if (!DTO) {
            throw CDTOValidator.Exception(`{ DTO } can't be undefined`);
        }

        if (!(DTO instanceof Object)) {
            throw CDTOValidator.Exception(`{ DTO } should be an object`);
        }

        if (!(value instanceof Object)) {
            throw CDTOValidator.Exception(`{ value } should be an object`);
        }

        this.value = value;
        this.DTO = DTO;
    }

    validate(opt = {}) {
        const {
            ignoreNotExistsFields = false
        } = opt;

        let errorProps = {};
        let schema = {};

        if (this.DTO instanceof Function) {
            schema = new this.DTO();
        } else if (this.DTO instanceof Object) {
            schema = this.DTO;
        }

        if (!schema) {
            return {valid: false, ...CDTOValidator.Exception('incorrectly schema constructor')}
        }

        this.valid = true;

        function checkSchema(_valObjKey, __schema) {
            if (!ignoreNotExistsFields) {
                if (!_valObjKey) {
                    errorProps = CDTOValidator.Exception(`_valObjKey is undefined.`);
                    return false;
                }

                if (!__schema[_valObjKey]) {
                    errorProps = CDTOValidator.Exception(`Key { ${_valObjKey} } is not declare in DTO.`);
                    return false;
                }

                if (!__schema[_valObjKey].hasOwnProperty('required')) {
                    errorProps = CDTOValidator.Exception(`Key { ${_valObjKey} } hasn't important property => [required], please add that prop.`);
                    return false;
                }

                if (typeof __schema[_valObjKey].required !== 'boolean') {
                    errorProps = CDTOValidator.Exception(`Key { ${_valObjKey} } required should be a Boolean type.`);
                    return false;
                }

                if (!__schema[_valObjKey].hasOwnProperty('type')) {
                    errorProps = CDTOValidator.Exception(`Key { ${_valObjKey} } hasn't important property => [type], please add that prop.`);
                    return false;
                }
            }

            return true;
        }

        const checkFieldsIsExists = () => {
            let flag = true;
            let checkSchemaError = false;
            let key = '';

            function check(object, schema) {
                for (let property in object) {
                    if (object.hasOwnProperty(property)) {
                        if (!checkSchema(property, schema)) {
                            checkSchemaError = true;
                            flag = false;
                            key = property;
                            break;
                        }

                        if (schema && !schema[property]) {
                            flag = false;
                            key = property;
                            break;
                        }

                        if (typeof object[property] == 'object') {
                            check(object[property], schema[property]);
                        }
                    }
                }
            }

            check.bind(this)(this.value, schema);

            return {flag, key, checkSchemaError};
        }

        const checkFieldsExistsResult = checkFieldsIsExists();

        if (!checkFieldsExistsResult.flag) {
            if (!ignoreNotExistsFields) {
                if (!checkFieldsExistsResult.checkSchemaError) {
                    errorProps = CDTOValidator.Exception(`Key { ${checkFieldsExistsResult.key} } of validate object does not exists in validation schema`);
                }

                this.valid = false;
            }
        }

        if (this.valid) {
            for (const valObjKey in this.value) {
                if (!schema[valObjKey]) {
                    continue;
                }

                const _value = this.value[valObjKey];
                const _schemaItem = schema[valObjKey];

                const typeChecker = (__val__, __schemaItem__) => {
                    const __valueType__ = Object.getPrototypeOf(__val__).constructor;

                    if (__schemaItem__.type instanceof Array && __schemaItem__.type.length) {
                        let stackTypesOfArray = [];

                        __schemaItem__.type.forEach(t => {
                            stackTypesOfArray = [...stackTypesOfArray, {type: t, valid: __valueType__ === t}];
                        });

                        const result = stackTypesOfArray.filter(v => v.valid);
                        if (!result.length) {
                            errorProps = CDTOValidator.Exception(`The value { ${__val__} } has nothing to do with the types of array { ${__schemaItem__.type} }`);
                            return false;
                        }
                    } else if (__schemaItem__.type === 'any') {
                        return true;
                    } else {
                        if (__valueType__ !== __schemaItem__.type) {
                            errorProps = CDTOValidator.Exception(`The value { ${__val__} } has nothing to do with the type { ${__schemaItem__.type} }`);
                            return false;
                        }
                    }

                    return true;
                }

                const __recursivePropValidate = (__val__, __schemaItem__, __valObjKey__) => {
                    const __valueType__ = Object.getPrototypeOf(__val__).constructor;

                    if (!typeChecker(__val__, __schemaItem__)) {
                        return false;
                    }

                    if (__schemaItem__.required) {
                        switch (__valueType__) {
                            case String: {
                                if (!__val__.length) {
                                    errorProps = CDTOValidator.Exception(`The key { ${__valObjKey__} } is empty string, which is required!`);
                                    return false;
                                }
                                break;
                            }

                            case Number: {
                                if (isNaN(__val__)) {
                                    errorProps = CDTOValidator.Exception(`The key { ${__valObjKey__} } is NaN, which is required!`);
                                    return false;
                                }
                                break;
                            }

                            case Object: {
                                if (!Object.keys(__val__).length) {
                                    errorProps = CDTOValidator.Exception(`The key { ${__valObjKey__} } is empty object, which is required!`);
                                    return false;
                                }
                                break;
                            }

                            case Array: {
                                if (!__val__.length) {
                                    errorProps = CDTOValidator.Exception(`The key { ${__valObjKey__} } is empty array, which is required!`);
                                    return false;
                                }
                                break;
                            }
                        }
                    }

                    return true;
                }

                if (Object.keys(schema[valObjKey]).length <= 2) {
                    if (!__recursivePropValidate(_value, _schemaItem, valObjKey)) {
                        this.valid = false;
                        break;
                    }
                } else {
                    const recursiveForEachValidate = (__val__, __schemaItem__, __valObjKey__, root) => {
                        if (root) {
                            if (!__recursivePropValidate(_value, _schemaItem, valObjKey)) {
                                this.valid = false;
                            }
                        }

                        for (const depthsKey in __val__) {
                            if (!__recursivePropValidate(__val__[depthsKey], __schemaItem__[depthsKey], depthsKey)) {
                                this.valid = false;
                                break;
                            }

                            if (__schemaItem__[depthsKey] && Object.keys(__schemaItem__[depthsKey]).length > 2) {
                                recursiveForEachValidate(__val__[depthsKey], __schemaItem__[depthsKey]);
                            }
                        }
                    }

                    recursiveForEachValidate(_value, _schemaItem, valObjKey, true);
                }
            }
        }

        return ({
            valid: this.valid,
            ...errorProps
        });
    }

    static Exception(string) {
        return ({message: `[CDTOValidator]: ${string}\t`});
    }
}

module.exports = CDTOValidator;
