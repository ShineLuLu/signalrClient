import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Sample from "@/components/signalr/accountSample";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Sample',
      component: Sample
    }
  ]
})
