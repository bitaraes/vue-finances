<template>
  <div>
    <AppToolbar v-model="drawer" />
    <AppMenu v-model="drawer" />

    <v-container grid-list-md>
      <v-layout>
        <v-flex xs12>
          <slot></slot>
        </v-flex>
      </v-layout>
    </v-container>
    <AppFloatingButton />
  </div>
</template>

<script>
import AppMenu from "./AppMenu.vue";
import AppFloatingButton from "./AppFloatingButton.vue";
import AppToolbar from "./AppToolbar.vue";

export default {
  name: "AppLayout",
  components: {
    AppToolbar,
    AppFloatingButton,
    AppMenu,
  },
  data() {
    return {
      drawer: false,
    };
  },
};
</script>

<style></style>
