// const moment = require('moment');

/* global Log, Module, moment, config */
/* Magic Mirror
 * Module: on-this-day
 *
 * By Ellie Fairholm
 */

Module.register("on-this-day", {

  // Default configuartion:

  defaults: {
    updateInterval: undefined, // the fact will update daily at 00:00, if you want it to be updated more regularly specify a time in ms 
    apiBase: "localhost://3003", // if i publish the api this will later be the api url
    appid: "/facts", // if my database is big enough then this will be able to be changed to sport etc
    animationSpeed: 1000,
    interest: ["history"], // if my database is big enough then this will be able to be changed to sport etc
  },

  // If the language setting has been changed in the main config file:

  // translateText: function (fact) {

  //   // takes the language from the config file:

  //   const language = config.language;
  //   const fact = "hello";
  //   const translatedFact = "bonjour";
  //   return translatedFact
  // },

  // Define start sequence:

  start: function () {

    Log.info("Starting module: ", this.name);

    this.title = "On this day in ";
    this.year = "2020"; // change this to be dynamic
    this.fact = "Your daily fact is being loaded."
  },

  // Override dom generator.
  getDom: function () {
    const wrapper = document.createElement("div");
    const titleWrapper = document.createElement("div");
    const yearWrapper = document.createElement("span");
    const colonWrapper = document.createElement("span");
    const factWrapper = document.createElement("div");

    // Stylings for my wrappers:

    wrapper.className = "container";
    titleWrapper.className = "title dimmed medium normal";
    yearWrapper.className = "title bright medium light";
    colonWrapper.className = "title dimmed medium normal";
    factWrapper.className = "title bright medium light";

    // Set default values for my wrappers:

    titleWrapper.innerHTML = this.title;
    yearWrapper.innerHTML = this.year;
    colonWrapper.innerHTML = ":";
    factWrapper.innerHTML = this.fact;

    titleWrapper.appendChild(yearWrapper);
    titleWrapper.appendChild(colonWrapper);

    wrapper.appendChild(titleWrapper);
    wrapper.appendChild(factWrapper);

    // Return the wrapper to the DOM:

    return wrapper;
  },

  scheduleUpdateRequest: function (delay) {
    const self = this;

    const date = Date.now();

    const formattedDate = moment(date).format('L').slice(0, 5);
    const time = moment(date).format('HH:mm');

    const specifiedDelay = this.config.updateInterval;

    if (specifiedDelay) {
      setInterval(function () {
        self.getFact(formattedDate);
      }, delay);
    }

    // Automatically programs the fact to update at midnight:

    if (time === "00:00") getFact(formattedDate);

  },

  // Retrieve the fact from the API:

  getFact: async function (date) {
    if (!this.config.appid) Log.error('on-this-day: APPID not set!');

    const self = this;
    const url = this.config.apiBase + this.config.appid;

    const data = await fetch(url)
      .then(result => result.status < 400 ? result : Promise.reject())
      .then(result => result.status === 204 ? result : result.json())
      .catch(error => Log.error(error));

    if (data) this.updateFact(data);
    else Log.error('on-this-day: unable to get fact!');
  },

  // Re-render the DOM:

  updateFact: function (data) {

    this.year = data.year
    this.fact = data.fact

    this.updateDom(this.config.animationSpeed);

  }

});

// need to translate on this day in...