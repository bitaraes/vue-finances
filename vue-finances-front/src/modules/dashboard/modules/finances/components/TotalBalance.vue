<template>
  <v-card :color="color">
    <v-card-title primary-title>
      <div class="text-center ma-auto">
        <p class="subheading">Saldo Atual</p>
        <h1 class="display-2">{{ totalCurrency }}</h1>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
import formatCurrencyMixin from "@/mixins/format-currency";
import recordsService from "../services/records-service";

export default {
  name: "TotalBalance",
  mixins: [formatCurrencyMixin],
  data() {
    return {
      total: 0,
    };
  },
  computed: {
    color() {
      return this.total < 0 ? "error" : "primary";
    },
    totalCurrency() {
      return this.formatCurrency(this.total);
    },
  },
  async created() {
    this.total = await recordsService.totalBalance();
  },
};
</script>

<style></style>
