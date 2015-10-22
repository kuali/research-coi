import alt from '../alt';

class _ColorActions {
  setColorBlindMode(newValue) { this.dispatch(newValue); }
}

export default alt.createActions(_ColorActions);
