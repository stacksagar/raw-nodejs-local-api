const eventsEmitter = require('events');

class School extends eventsEmitter {
  startPeriod() {
    console.log('class started');

    setTimeout(() => {
      this.emit('bellRing', {
        success: 'success',
        codeNumber: 332234,
      });
    }, 1000);

  }
}

module.exports = School;
