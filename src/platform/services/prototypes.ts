//? Service to add functionality on default Constructors

export default {
  init: () => {
    Date.prototype.toTimezoneISOString = function() {
      const tzoffset = this.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(this.getTime() - tzoffset)).toISOString();
      
      return localISOTime;
    };
  },
};