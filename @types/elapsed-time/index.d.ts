declare module "elapsed-time" {
  type TrackerEntry = {
    getValue: () => string;
  };
  type TimeTracker = {
    start: () => TrackerEntry;
  };
  type ElapsedTime = {
    new: () => TimeTracker;
  };
  declare const elapsedTime: ElapsedTime;

  export default elapsedTime;
}
