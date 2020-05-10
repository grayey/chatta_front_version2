const env = process.env.NODE_ENV;
const app_mode = env ? env.trim() : "development";
console.log("env", env, process.env);

const environment = {
  development: {
    // base_url: "https://mychattaback.herokuapp.com",
    base_url: "http://localhost:9000",
    base_url_front: "https://mychatta-9b722.firebaseapp.com",
  },
  production: {
    base_url: "https://mychattaback.herokuapp.com",
    base_url_front: "https://mychatta-9b722.firebaseapp.com",
  },
};

export const APP_ENVIRONMENT = environment[app_mode];
// https://mychatta-9b722.firebaseapp.com
//base url => https://aqueous-thicket-45068.herokuapp.com
