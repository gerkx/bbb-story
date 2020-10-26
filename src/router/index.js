import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Import from '../views/Import';
import Supers from '../views/Supers';
import Export from '../views/Export';


Vue.use(VueRouter)

const routes = [
  {
    path: '/import',
    name: 'Import',
    component: Import
  },
  {
    path: '/supers',
    name: 'Supers',
    component: Supers
  },
  {
    path: '/export',
    name: 'Export',
    component: Export
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
