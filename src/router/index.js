import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EstudianteView from '../views/estudiante/EstudianteView.vue'
//import DisciplinaView from '../views/disciplina/DisciplinaView.vue'
import CarreraView from '../views/carrera/CarreraView.vue'
import ListaDisipView from '../views/disciplina/ListaDisipView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/carrera',
    name: 'carrera',
    component: CarreraView
  },
  {
    path: '/estudiante',
    name: 'estudiante',
    component: EstudianteView
  },
  {
    path: '/disciplina',
    name: 'disciplina',
    component: ListaDisipView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
