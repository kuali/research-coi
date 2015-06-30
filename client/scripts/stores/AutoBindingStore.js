export class AutoBindingStore {
  constructor(Actions) {
    let bindings = {};
    for (let propName in Actions) {
      if (propName.charCodeAt(0) < 91) {
        let fixedName = propName.toLowerCase().replace(/_([a-z])/gi, function(s, group1) {
            return group1.toUpperCase();
        });
        bindings[fixedName] = Actions[propName];
      }
    }

    this.bindListeners(bindings);
  }
}