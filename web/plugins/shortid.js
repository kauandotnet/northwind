import Vue from 'vue';
import shortid from 'shortid';

Vue.prototype.$shortid = () => {
  const id = shortid.generate();
  return id.replace(/[\d-]+/, '');
};
