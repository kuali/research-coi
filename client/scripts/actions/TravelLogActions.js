import alt from '../alt';

class _TravelLogActions {
  addEntry(entityName, amount, startDate, endDate, reason, destination) {
    this.dispatch({
      entityName: entityName,
      amount: amount,
      startDate: startDate,
      endDate: endDate,
      reason: reason,
      destination: destination
    });
  }
  loadTravelLogEntries() {
    this.dispatch();
  }
}
export let TravelLogActions = alt.createActions(_TravelLogActions);
