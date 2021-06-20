import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'
import admin from '@/components/admin/admin.vue'
import login from '@/components/login/login.vue'
import Help from '@/components/Help/Help.vue'
import permis from '@/components/Help/permis.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
		{
		  path: 'Help',
		  name: 'Help',
		  component: Help,
		},
		{
		  path: 'admin',
		  name: 'admin',
		  component: admin,
		},
    {
      path: 'login',
      name: 'login',
      component: login,
    },
    {
      path: 'permis',
      name: 'permis',
      component: permis,
    }
  ]
})
