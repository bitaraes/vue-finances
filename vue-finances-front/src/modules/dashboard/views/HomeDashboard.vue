<template>
  <AppLayout>
    <router-view></router-view>
  </AppLayout>
</template>

<script>
import AppLayout from "../components/AppLayout.vue";

export default {
  name: "HomeDashboard",
  components: {
    AppLayout,
  },
};
</script>
