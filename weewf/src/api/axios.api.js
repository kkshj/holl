import Vue from 'vue'
import Axios from 'axios'

export default {
  get (url, params) {
    return new Promise((resolve, reject) => {
      Axios.get(url, params).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  },
  post (url, body, params) {
    return new Promise((resolve, reject) => {
      Axios.post(url, body, params).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  },
  put (url, body, params) {
    return new Promise((resolve, reject) => {
      Axios.put(url, body, params).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  },
  delete (url, params) {
    return new Promise((resolve, reject) => {
      Axios.delete(url, params).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  }
}
