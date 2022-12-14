const Dashboard = () => import("../views/HomeDashboard.vue");

export default [
  {
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true}
  }
]