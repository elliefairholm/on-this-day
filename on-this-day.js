/* global Log, Module, moment, config */
/* Magic Mirror
 * Module: on-this-day
 *
 * By Ellie Fairholm
 */

/* eslint-disable indent */

Module.register("on-this-day", {

  // Default configuartion:

  defaults: {
    updateInterval: undefined, // the fact will update daily at 00:00, if you want it to be updated more regularly specify a time in ms
    apiBase: "http://localhost:3003", // if i publish the api this will later be the api url
    appid: "/facts", // if my database is big enough then this will be able to be changed to sport etc
    animationSpeed: 1000,
    interest: ["general"], // if my database is big enough then this will be able to be changed to sport etc
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

    this.getDate();
    this.getFact(this.formattedDate);

  },

  getDate: function () {

    const date = setInterval(function () {
      return Date.now();
    }, 1000 * 60);

    this.formattedDate = moment(Date.now()).format("L").slice(0, 5).replace("/", "-");
    this.time = moment(date).format("HH:mm");
  },

  // Override dom generator.
  getDom: function () {

    // If there is no fact, nothing loads:

    if (!this.fact) {
      return;
    }

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

    titleWrapper.innerHTML = "On this day in ";
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

    const specifiedDelay = this.config.updateInterval;

    if (specifiedDelay) {
      setInterval(function () {
        self.getFact(formattedDate);
      }, delay);
    }

    // Automatically programs the fact to update at midnight:

    if (this.time === "00:00") {
      self.getFact(formattedDate);
    }

  },

  // Retrieve the fact from the API:

  getFact: async function (formattedDate) {
    if (!this.config.appid) {
      Log.error("on-this-day: APPID not set!");
    }

    const self = this;
    const url = this.config.apiBase + this.config.appid;

    let data = await fetch(`${url}/${formattedDate}`)
      .then(result => result.status < 400 ? result : Promise.reject())
      .then(result => result.status === 204 ? result : result.json())
      .catch(error => Log.error(error));

    // Choose a random fact from the array returned from the API:

    if (data && data.length) {
      const index = Math.floor(Math.random() * data.length);
      data = data[index];
      self.updateFact(data);
    } else {
      Log.error("on-this-day: unable to get fact!");
    };
  },

  // Re-render the DOM:

  updateFact: function (data) {

    this.year = data.year;
    this.fact = data.fact;

    this.updateDom(this.config.animationSpeed);

  }

});

// need to translate on this day in...