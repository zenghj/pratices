const homeComponent = new Component({
  render({query, meta}) {
    return `
      <h1>Home</h1>
      <div>
      query: ${query}
      </div>
      <div>
      meta: ${meta}
      </div>
      <div>
        ${routeAnchorBuilder({
          mode: this.props.$router.options.mode, 
          path: '/example/page2', 
          child: 'page2'
        })}
      </div>
    `
  }
})

const page2Component = new Component({
  render({query, meta}) {
    return `
      <h1>Page2</h1>
      <div>
      query: ${query}
      </div>
      <div>
      meta: ${meta}
      </div>
      <div>
        ${routeAnchorBuilder({
          mode: this.props.$router.options.mode, 
          path: '/example/', 
          child: 'home'
        })}
      </div>
    `
  }
})

const router = new FERouter({
  // mode: 'hash',
  mode: 'history',
  routes: [
    {
      path: '/example/',
      component: homeComponent
    },
    {
      path: '/example/page2',
      component: page2Component
    }
  ],
})