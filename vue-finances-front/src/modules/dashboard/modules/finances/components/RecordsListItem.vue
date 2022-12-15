<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon :class="[recordIconColor(record.type), 'darken-5']">
        {{ recordIcon(record.type) }}
      </v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>
        {{ record.description }}
      </v-list-item-title>
      <v-list-item-sub-title>
        {{ record.category.description }} | {{ record.account.description }}
      </v-list-item-sub-title>
    </v-list-item-content>

    <v-list-item-action>
      <span :class="amountColor(record.amount)">
        {{ formatCurrency(record.amount) }}
      </span>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import amountColorsMixin from "../mixins/amount-colors";
import formatCurrencyMixin from "@/mixins/format-currency";
export default {
  name: "RecordsListItem",
  mixins: [formatCurrencyMixin, amountColorsMixin],
  props: {
    record: Object,
  },
  methods: {
    amountColor(amount) {
      return amount < 0
        ? "error--text text--darken-5"
        : "primary--text text--darken-5";
    },
    recordIcon(type) {
      return type === "CREDIT" ? "arrow_upward" : "arrow_downward";
    },
    recordIconColor(type) {
      return type === "CREDIT" ? "primary" : "error";
    },
  },
};
</script>

<style></style>
