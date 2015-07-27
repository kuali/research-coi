export class AutoBindingStore {
  constructor(Actions) {
    let bindings = {};
    let replacementFunction = (s, group1) => {
      return group1.toUpperCase();
    };
    for (let propName in Actions) {
      if (propName.charCodeAt(0) < 91) {
        let fixedName = propName.toLowerCase().replace(/_([a-z])/gi, replacementFunction);
        bindings[fixedName] = Actions[propName];
      }
    }

    this.bindListeners(bindings);
  }
}
