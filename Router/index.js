export class HashRoute {
  constructor () {
    this.routes = {}; // stack
    this.currentUrl = '';
    this.replace = this.replace.bind(this);
    this.route = this.route.bind(this);
    window.addEventListener('hashchange', this.replace, false);
    window.addEventListener('load', this.replace, false);
  }

  replace() {
    const hash = this.getHash();
    console.log('hashchange now', hash);
    this.currentUrl = hash || '/';
    this.routes[this.currentUrl] && this.routes[this.currentUrl]();
  }

  route(key, cb) {
    this.routes[key] = cb || function(){};
  }

  getHash() {
    // 借鉴 vue-router ，由于兼容问题，不直接使用 location.hash
    const href = window.location.href
    const index = href.indexOf('#')
    return index === -1 ? '' : decodeURI(href.slice(index + 1));
  }
}

export class Html5Route {
  constructor () {
    this.routes = {};
    this.currentUrl = '';
    this.replace = this.replace.bind(this);
    this.route = this.route.bind(this);
    this.go = this.go.bind(this);
    window.addEventListener('popstate', this.replace, false);
    window.addEventListener('load', this.replace, false);
  }

  init(path) {
    history.replaceState({ path: path }, null, path);
    this.routes[path] && this.routes[path]();
  }

  replace(e) {
    console.log('history object change now', window.history.state);
    const path = e.state && e.state.path;
    this.routes[path] && this.routes[path]();
  }

  route(path, cb) {
    this.routes[path] = cb || function(){};
  }

  go(path) {
    try {
      window.history.pushState({ path: path }, null, path);
      this.routes[path] && this.routes[path]()
    } catch (e) {};
  }
}
