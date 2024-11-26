'use strict';

//Workout
class Workout {
  constructor(distance, duration, coords) {
    this.date = new Date();
    this.id = +this.date;
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(distance, duration, cadence, coords) {
    super(distance, duration, coords);
    this.cadence = cadence;
    this.#calcSpeed();
    this.#setDescription();
  }
  #calcSpeed() {
    this.speed = ((this.duration * 60) / this.distance).toFixed(1);
  }

  #setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type.replace(
      this.type[0],
      this.type[0].toUpperCase()
    )} on ${this.date.getDate()}/${this.date.getMonth() + 1}/${(
      this.date.getFullYear() + ''
    ).slice(-2)}`;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(distance, duration, elevGain, coords) {
    super(distance, duration, coords);
    this.elevGain = elevGain;
    this.#calcSpeed();
    this.#setDescription();
  }
  #calcSpeed() {
    this.speed = (this.distance / (this.duration / 60)).toFixed(1);
  }

  #setDescription() {
    this.description = `${this.type.replace(
      this.type[0],
      this.type[0].toUpperCase()
    )} on ${this.date.getDate()}/${this.date.getMonth() + 1}/${(
      this.date.getFullYear() + ''
    ).slice(-2)}`;
  }
}

//App

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map = L.map('map');
  #zoomLevel = 14;
  #mapEvent;
  #curPin;
  // #mapPins = [];
  #workouts = [];
  constructor() {
    this.#getPosition();
    inputType.addEventListener('change', this.#switchInputFields.bind(this));
    form.addEventListener('submit', this.#addWorkout.bind(this));
    this.#map.on('click', this.#mapClick.bind(this));
    containerWorkouts.addEventListener('click', this.#goToWorkout.bind(this));
    document.addEventListener('keydown', this.#clearLocal.bind(this));
    this.#getFromLocal();
  }

  #getPosition() {
    navigator.geolocation.getCurrentPosition(
      this.#successPosition.bind(this),
      this.#unSuccessPositon,
      {
        enableHighAccuracy: true,
      }
    );
  }

  #successPosition(position) {
    const { latitude: lat, longitude: lng } = position.coords;
    this.#loadMap(lat, lng);
  }

  #unSuccessPositon() {
    alert("Couldn't get your location");
  }

  #loadMap(lat, lng) {
    this.#map.setView([lat, lng], this.#zoomLevel);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
  }

  #putMarker(e) {
    this.#mapEvent = e;
    const { lat, lng } = e.latlng;
    this.#curPin = L.marker([lat, lng]).addTo(this.#map);
  }

  #showForm() {
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  #hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.classList.add('hidden');
  }

  #switchInputFields() {
    inputCadence.parentElement.classList.toggle('form__row--hidden');
    inputElevation.parentElement.classList.toggle('form__row--hidden');
    inputDistance.focus();
  }
  #renderWorkoutSideBar(workout) {
    let toPush = `<li class="workout workout--${workout.type}" data-id=${
      workout.id
    }>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed}</span>
            <span class="workout__unit">min/km</span>
          </div>`;

    if (workout.type === 'running') {
      toPush += `
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
    }

    if (workout.type === 'cycling') {
      toPush += `
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;
    }
    form.insertAdjacentHTML('afterend', toPush);
  }
  #renderWorkout(workout) {
    this.#renderWorkoutSideBar(workout);
    this.#curPin
      .bindPopup(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`,
        {
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        }
      )
      .openPopup();
  }
  #addWorkout(e) {
    e.preventDefault();
    const checkIsNumber = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const checkIsPossitive = (...inputs) => inputs.every((inp) => inp > 0);

    //Get the data from the Form
    let workout;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const workoutType = inputType.value;
    const { lat, lng } = this.#mapEvent.latlng;

    //Check if it's running
    if (workoutType === 'running') {
      const cadence = +inputCadence.value;

      //Guard clause for Inputs
      if (
        !checkIsNumber(distance, duration, cadence) ||
        !checkIsPossitive(distance, duration, cadence)
      )
        return alert('The Inputs should be possitive numbers!');

      workout = new Running(distance, duration, cadence, [lat, lng]);
    }
    //Chek if it's cycling
    if (workoutType === 'cycling') {
      const elevGain = +inputElevation.value;

      //Guard clause for Inputs
      if (
        !checkIsNumber(distance, duration, elevGain) ||
        !checkIsPossitive(distance, duration, elevGain)
      )
        return alert('The Inputs should be possitive numbers!');

      workout = new Cycling(distance, duration, elevGain, [lat, lng]);
    }
    this.#workouts.push(workout);

    this.#hideForm();

    this.#renderWorkout(workout, this.#curPin);

    this.#saveOnLocal();
  }

  #mapClick(e) {
    this.#putMarker(e);
    this.#showForm();
  }

  #goToWorkout(e) {
    const target = e.target.closest('.workout');
    if (!target) return;

    const workout = this.#workouts.find(
      (work) => work.id === +target.dataset.id
    );

    this.#map.flyTo(workout.coords, this.#zoomLevel, {
      animate: true,
      duration: 1,
      easeLinearity: 0.25,
    });
  }

  #saveOnLocal() {
    const workoutsLS = JSON.stringify(this.#workouts);
    localStorage.setItem('workouts', workoutsLS);
    // const mapPinsLS = JSON.stringify(this.#mapPins);
    // localStorage.setItem('mapPins', mapPinsLS);
  }

  #getFromLocal() {
    const workoutsLS = localStorage.getItem('workouts');
    const mapPins = localStorage.getItem('mapPins');
    if (!workoutsLS) return;
    this.#workouts = JSON.parse(workoutsLS);
    this.#workouts.forEach((work) => {
      this.#renderWorkoutSideBar(work);
      this.#createMarker(work);
    });
  }

  #createMarker(workout) {
    const mark = L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`,
        {
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        }
      )
      .openPopup();
  }

  #clearLocal(e) {
    if (e.key === 'Delete') {
      localStorage.removeItem('workouts');
      localStorage.removeItem('mapPins');
    }
  }
}

const app = new App();
