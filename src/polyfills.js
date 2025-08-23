// Basic polyfills for React Native
if (typeof global.Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

if (typeof global.process === 'undefined') {
  global.process = require('process/browser');
}

// Crypto polyfill
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: function(array) {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
    subtle: {}
  };
}