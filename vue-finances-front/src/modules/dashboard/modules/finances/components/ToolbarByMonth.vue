<template>
  <v-toolbar :color="color">
    <v-layout align-center>
      <v-flex xs1>
        <div class="text-left">
          <v-btn icon text @click="decrement">
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </div>
      </v-flex>

      <v-flex xs10>
        <v-toolbar-title class="text-center">
          <span>{{ currentMont }}</span>
        </v-toolbar-title>
      </v-flex>

      <v-flex xs1>
        <div class="text-right">
          <v-btn icon text @click="increment">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-toolbar>
</template>

<script>
import moment from "moment";

export default {
  name: "toolbarByMonth",
  props: {
    format: String,
    color: String,
    month: String,
  },
  data() {
    return {
      date: undefined,
    };
  },
  computed: {
    currentMont() {
      return this.date.format("MMMM YYYY");
    },
  },
  created() {
    this.setCurrentMonth();
    this.emit();
  },
  methods: {
    emit() {
      this.$emit("month", this.date.format(this.format));
    },
    increment() {
      this.date = this.date.clone().add(1, "month");
      this.emit();
    },
    decrement() {
      this.date = this.date.clone().subtract(1, "month");
      this.emit();
    },
    setCurrentMonth() {
      this.date = this.month ? moment(this.month, this.format) : moment();
    },
  },
};
</script>

<style></style>
