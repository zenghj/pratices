class BaseRouter {
  constructor(options) {
    this.options = Object.assign({
      mode: 'hash',
      routes: [],
      container: '#router'
    }, options)
    const routes = this.options.routes
    if (routes.length > 0) {
      this.options.routes = routes.map(item => {
        return item instanceof Route ? item : new Route({
          ...item,
          router: this
        })
      })
    }
    this.container = document.querySelectorAll(this.options.container)[0]
    if (!this.container) {
      throw new Error('cannot find router container')
    }
    this.init()
  }
  matchRoute(route) {
    return this.options.routes.find(
      item => (item.name && item.name === route.name) || item.path === route.path 
    )
  }
  renderRoute(route) {
    const targetRoute = this.matchRoute(route)
    if (targetRoute) {
      this.renderContainer(targetRoute.render({
        query: route.query,
        meta: route.meta
      }))
    } else {
      throw new Error('matchRoute fail', route, this.options.routes)
    }
  }
  renderContainer(html) {
    this.container.innerHTML = html
  }
}

class Component {
  constructor({render}) {
    this.props = {}
    this.renderComponent = render
  }
  render(props) {
    this.props = props
    return this.renderComponent(props)
  }
}

class Route {
  constructor({name, path, query, meta, component, router}) {
    this.name = name
    this.path = path
    this.query = query
    this.meta = meta
    this.component = component
    this.$router = router
  }
  render({query, meta}) {
    return this.component.render({query, meta, $router: this.$router})
  }
}

class HashRouter extends BaseRouter {
  init() {
    window.addEventListener('hashchange', this.handleRouteChange.bind(this))
    this.renderRoute(
      this.parseRoute(window.location.hash)
    )
  }
  handleRouteChange(e) {
    let hash = window.location.hash
    let route = this.parseRoute(hash)
    this.renderRoute(route)
  }
  parseRoute(hash) {
    return new Route({
      path: hash.slice(1)
    })
  }
}

class HistoryRouter extends BaseRouter {
  init() {
    // window.addEventListener('popstate', this.handleRouteChange.bind(this))
    this.renderRoute(
      this.parseRoute(window.location.pathname)
    )

    window.addEventListener('click', e => {
      const target = e.target
      if (target.classList && [].includes.call(target.classList, 'history-router-anchor')) {
        e.preventDefault()
        const path = target.getAttribute('href')
        this.push({
          path
        })
        return false;
      }
    })
  }


  parseRoute(path) {
    return new Route({
      path
    })
  }
  handleRouteChange(e) {
    const path = e.state && e.state.path
    this.renderRoute(this.parseRoute(path))
  }

  push(route) {
    window.history.pushState({
      url: location.origin + route.path,
      path: route.path
    }, '', route.path)
    this.renderRoute(
      this.parseRoute(route.path)
    )
  }
}

class FERouter {
  /**
   * 
   * @param {*} options 
   * options.mode
   * options.container
   * options.routes
   */
  constructor(options) {
    this.options = options
    this.instance = this.createRouterInstance(options.mode)
  }

  createRouterInstance(mode) {
    if (mode === 'history') {
      return new HistoryRouter(this.options)
    } else {
      return new HashRouter(this.options)
    }
  }
}

function routeAnchorBuilder({mode, path, child}) {
  if (mode === 'history') {
    return `<a class="history-router-anchor" href="${path}">${child}</a>`
  } else {
    return `<a class="hash-router-anchor" href="#${path}">${child}</a>`
  }
}
