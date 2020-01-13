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
    apiBase: "http://intense-sierra-66192.herokuapp.com",
    appid: "/facts",
    animationSpeed: 1000,
    interests: ["history"],
  },

  // Define start sequence:

  start: function () {

    Log.info("Starting module: ", this.name);

    this.getDate();
    this.getFact(this.formattedDate);
    this.scheduleUpdateRequest(this.formattedDate);

  },

  getDate: function () {

    const date = setInterval(function () {
      return Date.now();
    }, 1000 * 60);

    this.formattedDate = moment(Date.now()).format("L").slice(0, 5).replace("/", "-");
  },

  // Override dom generator.

  getDom: function () {

    // If there is no fact, nothing should load:

    if (!this.fact) {
      const wrapper = document.createElement("div");
      const loading = document.createElement("div");

      loading.innerHTML = "Loading...";

      wrapper.appendChild(loading);

      return wrapper;

    }

    // If there is a fact:

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

  // Automatically programs the fact to update at midnight:

  notificationReceived: function (notification, payload, sender) {
    const self = this;
    if (notification === "CLOCK_MINUTE") {
      const time = moment(Date.now()).format("HH:mm");
      if (time === "00:00") {
        self.getFact(self.formattedDate);
      }
    }
  },

  // To update the fact every x milliseconds if an update interval has been specified:

  scheduleUpdateRequest: function () {

    const self = this;

    const specifiedDelay = this.config.updateInterval;

    if (specifiedDelay) {
      setInterval(function () {
        self.getFact(self.formattedDate);
      }, specifiedDelay);
    }

  },

  // Retrieve the fact from the API:

  getFact: async function (formattedDate) {
    if (!this.config.appid) {
      Log.error("on-this-day: APPID not set!");
    }

    const self = this;
    const url = this.config.apiBase + this.config.appid;

    // Gets all the facts associated to the current day:

    let data = await fetch(`${url}/${formattedDate}`)
      .then(result => result.status < 400 ? result : Promise.reject())
      .then(result => result.status === 204 ? result : result.json())
      .catch(error => Log.error(error));

    // Filters the array of racts returned according to your interests (if different from the default 'general'):

    if (data && data.length) {
      formattedData = [];
      if (this.config.interests.length === 1 && !this.config.interests.includes("general") || this.config.interests.length > 1) {
        this.config.interests.forEach(function (interest) {
          data.forEach(function (fact) {
            if (fact.interests.includes(interest)) {
              formattedData.push(fact);
            }
          });
        });
      } else {
        formattedData = data.slice();
      }
      const index = Math.floor(Math.random() * formattedData.length);
      formattedData = formattedData[index];
      self.updateFact(formattedData);
    } else {
      Log.error("on-this-day: unable to get fact!");
    };
  },

  // Re-render the DOM:

  updateFact: function (data) {

    this.year = data.year;
    this.fact = data.fact;

    if (config.language !== "en") {
      this.translateText(this.fact);
    }

    this.updateDom(this.config.animationSpeed);

  }

});