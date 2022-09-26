/*
Stimulus 3.1.0
Copyright © 2022 Basecamp, LLC
 */

function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
}
function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
}

function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor) => {
        getOwnStaticArrayValues(constructor, propertyName).forEach(name => values.add(name));
        return values;
    }, new Set));
}
function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor) => {
        pairs.push(...getOwnStaticObjectPairs(constructor, propertyName));
        return pairs;
    }, []);
}
function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
        ancestors.push(constructor);
        constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
}
function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
}
function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map(key => [key, definition[key]]) : [];
}
(() => {
    function extendWithReflect(constructor) {
        function extended() {
            return Reflect.construct(constructor, arguments, new.target);
        }
        extended.prototype = Object.create(constructor.prototype, {
            constructor: { value: extended }
        });
        Reflect.setPrototypeOf(extended, constructor);
        return extended;
    }
    function testReflectExtension() {
        const a = function () { this.a.call(this); };
        const b = extendWithReflect(a);
        b.prototype.a = function () { };
        return new b;
    }
    try {
        testReflectExtension();
        return extendWithReflect;
    }
    catch (error) {
        return (constructor) => class extended extends constructor {
        };
    }
})();

function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
        return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
}
function propertiesForClassDefinition(key) {
    return {
        [`${key}Class`]: {
            get() {
                const { classes } = this;
                if (classes.has(key)) {
                    return classes.get(key);
                }
                else {
                    const attribute = classes.getAttributeName(key);
                    throw new Error(`Missing attribute "${attribute}"`);
                }
            }
        },
        [`${key}Classes`]: {
            get() {
                return this.classes.getAll(key);
            }
        },
        [`has${capitalize(key)}Class`]: {
            get() {
                return this.classes.has(key);
            }
        }
    };
}

function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
        return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
}
function propertiesForTargetDefinition(name) {
    return {
        [`${name}Target`]: {
            get() {
                const target = this.targets.find(name);
                if (target) {
                    return target;
                }
                else {
                    throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
                }
            }
        },
        [`${name}Targets`]: {
            get() {
                return this.targets.findAll(name);
            }
        },
        [`has${capitalize(name)}Target`]: {
            get() {
                return this.targets.has(name);
            }
        }
    };
}

function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
        valueDescriptorMap: {
            get() {
                return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
                    const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
                    const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
                    return Object.assign(result, { [attributeName]: valueDescriptor });
                }, {});
            }
        }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
        return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
}
function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
    const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
    const { key, name, reader: read, writer: write } = definition;
    return {
        [name]: {
            get() {
                const value = this.data.get(key);
                if (value !== null) {
                    return read(value);
                }
                else {
                    return definition.defaultValue;
                }
            },
            set(value) {
                if (value === undefined) {
                    this.data.delete(key);
                }
                else {
                    this.data.set(key, write(value));
                }
            }
        },
        [`has${capitalize(name)}`]: {
            get() {
                return this.data.has(key) || definition.hasCustomDefaultValue;
            }
        }
    };
}
function parseValueDefinitionPair([token, typeDefinition], controller) {
    return valueDescriptorForTokenAndTypeDefinition({
        controller,
        token,
        typeDefinition,
    });
}
function parseValueTypeConstant(constant) {
    switch (constant) {
        case Array: return "array";
        case Boolean: return "boolean";
        case Number: return "number";
        case Object: return "object";
        case String: return "string";
    }
}
function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
        case "boolean": return "boolean";
        case "number": return "number";
        case "string": return "string";
    }
    if (Array.isArray(defaultValue))
        return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
        return "object";
}
function parseValueTypeObject(payload) {
    const typeFromObject = parseValueTypeConstant(payload.typeObject.type);
    if (!typeFromObject)
        return;
    const defaultValueType = parseValueTypeDefault(payload.typeObject.default);
    if (typeFromObject !== defaultValueType) {
        const propertyPath = payload.controller ? `${payload.controller}.${payload.token}` : payload.token;
        throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${payload.typeObject.default}" is of type "${defaultValueType}".`);
    }
    return typeFromObject;
}
function parseValueTypeDefinition(payload) {
    const typeFromObject = parseValueTypeObject({
        controller: payload.controller,
        token: payload.token,
        typeObject: payload.typeDefinition
    });
    const typeFromDefaultValue = parseValueTypeDefault(payload.typeDefinition);
    const typeFromConstant = parseValueTypeConstant(payload.typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
        return type;
    const propertyPath = payload.controller ? `${payload.controller}.${payload.typeDefinition}` : payload.token;
    throw new Error(`Unknown value type "${propertyPath}" for "${payload.token}" value`);
}
function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
        return defaultValuesByType[constant];
    const defaultValue = typeDefinition.default;
    if (defaultValue !== undefined)
        return defaultValue;
    return typeDefinition;
}
function valueDescriptorForTokenAndTypeDefinition(payload) {
    const key = `${dasherize(payload.token)}-value`;
    const type = parseValueTypeDefinition(payload);
    return {
        type,
        key,
        name: camelize(key),
        get defaultValue() { return defaultValueForDefinition(payload.typeDefinition); },
        get hasCustomDefaultValue() { return parseValueTypeDefault(payload.typeDefinition) !== undefined; },
        reader: readers[type],
        writer: writers[type] || writers.default
    };
}
const defaultValuesByType = {
    get array() { return []; },
    boolean: false,
    number: 0,
    get object() { return {}; },
    string: ""
};
const readers = {
    array(value) {
        const array = JSON.parse(value);
        if (!Array.isArray(array)) {
            throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
        }
        return array;
    },
    boolean(value) {
        return !(value == "0" || String(value).toLowerCase() == "false");
    },
    number(value) {
        return Number(value);
    },
    object(value) {
        const object = JSON.parse(value);
        if (object === null || typeof object != "object" || Array.isArray(object)) {
            throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
        }
        return object;
    },
    string(value) {
        return value;
    }
};
const writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
};
function writeJSON(value) {
    return JSON.stringify(value);
}
function writeString(value) {
    return `${value}`;
}

class Controller {
    constructor(context) {
        this.context = context;
    }
    static get shouldLoad() {
        return true;
    }
    get application() {
        return this.context.application;
    }
    get scope() {
        return this.context.scope;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get targets() {
        return this.scope.targets;
    }
    get classes() {
        return this.scope.classes;
    }
    get data() {
        return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
        const type = prefix ? `${prefix}:${eventName}` : eventName;
        const event = new CustomEvent(type, { detail, bubbles, cancelable });
        target.dispatchEvent(event);
        return event;
    }
}
Controller.blessings = [ClassPropertiesBlessing, TargetPropertiesBlessing, ValuePropertiesBlessing];
Controller.targets = [];
Controller.values = {};

class input_clipboard_controller extends Controller {
  copy(_event) {
    const clipboardCopyEl = this.element;
    clipboardCopyEl.classList.add("clicked");
    setTimeout(() => {
      clipboardCopyEl.classList.remove("clicked");
    }, 5000);
  }

}

const Inputmask = require("inputmask").default;

class input_mask_controller extends Controller {
  connect() {
    Inputmask(this.data.get("pattern")).mask(this.element);
  }

}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class _class$1 extends Controller {
  connect() {
    this.element[this.identifier] = this;
    this.classToToggle = this.hasToggleClass ? this.toggleClass : "hidden";
    this.externalTargets = document.getElementsByClassName(this.data.get("externalTargetClass"));
  }

  classIsApplied() {
    return this.element.classList.contains(this.classToToggle);
  }

  toggle(event) {
    if (!this.data.has("allowDefault")) event.preventDefault();
    this.toggleControllerTargets();
    this.toggleExternalTargets();
  }

  toggleOff(event) {
    if (!this.data.has("allowDefault")) event.preventDefault();
    if (this.classIsApplied()) this.toggle(event);
  }

  toggleControllerTargets() {
    this.toggleableTargets.forEach(target => {
      this.toggleElementClassList(target);
    });
  }

  toggleExternalTargets() {
    for (let i = 0; i < this.externalTargets.length; ++i) {
      this.toggleElementClassList(this.externalTargets[i]);
    }
  }

  toggleElementClassList(targetElement) {
    targetElement.classList.toggle(this.classToToggle);
  }

}

_defineProperty(_class$1, "targets", ["toggleable"]);

_defineProperty(_class$1, "classes", ["toggle"]);

class _class extends Controller {
  // TODO: hardcoded to work with /for-leaders page - switch to using Values to customize active/inactive classes
  connect() {
    this.element[this.identifier] = this;
  }

  switch(event) {
    if (!this.data.has("allowDefault")) {
      event.preventDefault();
    }

    this.deactivate();
    this.activate(event.target);
  }

  deactivate() {
    this.switchableTargets.forEach(target => {
      target.classList.add("hidden");
    });
    this.clickableTargets.forEach(target => {
      target.classList.remove("text-gray-100", "border-gray-100");
      target.classList.add("border-gray-900");
    });
  }

  activate(currentElement) {
    currentElement.classList.remove("border-gray-900");
    currentElement.classList.add("text-gray-100", "border-gray-100");
    document.querySelectorAll(`.${currentElement.id}`).forEach(element => {
      element.classList.remove("hidden");
    });
  }

}

_defineProperty(_class, "targets", ["switchable", "clickable"]);

const Honeybadger = require("@honeybadger-io/js");

const getAppContext = () => {
  // TODO: Kali - remove this var once upstream Heroku/Doppler issues resolved
  if (process.env.EXPLICIT_APP_CONTEXT) return process.env.EXPLICIT_APP_CONTEXT;

  if (!process.env.HEROKU_APP_NAME) {
    console.log("WARN: production-ish environment is missing both HEROKU_APP_NAME and EXPLICIT_APP_CONTEXT");
    return;
  }

  const heroku = process.env.HEROKU_APP_NAME;
  return heroku.includes("-production") ? "production" : heroku.includes("-staging") ? "staging" : "review";
};

const initHoneybadger = (opts = {}) => {
  if (process.env.RAILS_ENV !== "production") return;
  const appContext = getAppContext();
  if (!appContext) return;

  if (!process.env.HONEYBADGER_JS_API_KEY) {
    console.log(`Honeybadger not configured -- set HONEYBADGER_JS_API_KEY to enable (for ${process.env.HEROKU_APP_NAME})`);
    return;
  }

  const config = Object.assign({
    apiKey: process.env.HONEYBADGER_JS_API_KEY,
    environment: appContext
  }, opts);
  Honeybadger.configure(config);
  window.Honeybadger = Honeybadger;
};

export { input_clipboard_controller as InputClipboardController, input_mask_controller as InputMaskController, _class as SwitchController, _class$1 as ToggleController, initHoneybadger };
