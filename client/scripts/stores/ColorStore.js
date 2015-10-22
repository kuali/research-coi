import ColorActions from '../actions/ColorActions';
import {AutoBindingStore} from './AutoBindingStore';
import alt from '../alt';

class _ColorStore extends AutoBindingStore {
  constructor() {
    super(ColorActions);
  }

  setColorBlindMode(newValue) {
    window.localStorage.setItem('colorBlindModeOn', newValue);
    window.colorBlindModeOn = newValue;
  }
}

export default alt.createStore(_ColorStore, 'ColorStore');
