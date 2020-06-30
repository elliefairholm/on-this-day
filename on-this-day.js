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
    apiBase: "http://on-this-day-api.herokuapp.com",
    path: "/facts",
    animationSpeed: 1000,
    interests: ["general"],
  },

  // Define start sequence:

  start: function () {

    Log.info("Starting module: ", this.name);

    this.getDate();
    this.getFact(this.formattedDate);
    this.scheduleUpdateRequest();

  },

  getDate: function () {
    const timeStamp = new Date;
    const month = (timeStamp.getMonth() + 1).toString().padStart(2, '0');
    const day = (timeStamp.getDate()).toString().padStart(2, '0');

    this.formattedDate = `${month}-${day}`;

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
    if (!this.config.path) {
      Log.error("on-this-day: this url path does not exist set!");
    }

    const self = this;
    const url = this.config.apiBase + this.config.path;

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
      const newFact = formattedData[index];
      self.updateFact(newFact);
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