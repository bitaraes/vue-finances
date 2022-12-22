<template>
  <div>
    <TotalBalance class="mb-2"></TotalBalance>
    <ToolbarByMonth
      format="MM-YYYY"
      @month="changeMonth"
      :color="toolbarColor"
      :month="$route.query.month"
    ></ToolbarByMonth>
    <v-card>
      <v-card-text class="text-center" v-if="mappedRecordsLength === 0">
        <v-icon size="100" color="grey">assignment</v-icon>
        <p class="font-weight-light subheading grey--text">
          Nenhum lançamento no período
        </p>
      </v-card-text>
      <v-list two-line subheader v-else>
        <template v-for="(records, date, index) in mappedRecords">
          <v-subheader :key="date">{{ date }}</v-subheader>
          <RecordsListItem
            v-for="record in records"
            :key="record.id"
            :record="record"
          />
          <v-divider
            :key="`${date}-${index}`"
            v-if="showDivider(index, mappedRecords)"
          ></v-divider>
        </template>
      </v-list>

      <v-footer class="pa-2">
        <v-flex text-right>
          <span>Saldo do mês</span>
          <strong class="ml-5" :class="amountColor(totalAmount)">{{
            formatCurrency(totalAmount)
          }}</strong>
        </v-flex>
      </v-footer>
    </v-card>
  </div>
</template>

<script>
import RecordsListItem from "./RecordsListItem.vue";
import ToolbarByMonth from "./ToolbarByMonth.vue";
import TotalBalance from "./TotalBalance.vue";

import amountColorsMixin from "../mixins/amount-colors";
import formatCurrencyMixin from "@/mixins/format-currency";
import recordsService from "../services/records-service";
import { groupBy } from "@/utils";

import moment from "moment";
import { Subject } from "rxjs";
import { mergeMap } from "rxjs/operators";

export default {
  name: "RecordsList",
  components: {
    RecordsListItem,
    ToolbarByMonth,
    TotalBalance,
  },
  mixins: [amountColorsMixin, formatCurrencyMixin],
  data() {
    return {
      records: [],
      monthSubject$: new Subject(),
      subscriptions: [],
    };
  },
  computed: {
    mappedRecords() {
      return groupBy(this.records, "date", (record, dateKey) => {
        return moment(record[dateKey].substr(0, 10)).format("DD/MM/YYYY");
      });
    },
    mappedRecordsLength() {
      return Object.keys(this.mappedRecords).length;
    },
    totalAmount() {
      return this.records.reduce((sum, record) => sum + record.amount, 0);
    },
    toolbarColor() {
      return this.totalAmount < 0 ? "error" : "primary";
    },
  },
  created() {
    this.setRecords();
  },
  destroyed() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  },
  methods: {
    changeMonth(month) {
      this.$router.push({
        path: this.$route.path,
        query: { month },
      });
      this.monthSubject$.next({ month });
    },
    showDivider(index, obj) {
      return index < Object.keys(obj).length - 1;
    },
    setRecords() {
      this.subscriptions.push(
        this.monthSubject$
          .pipe(mergeMap((variables) => recordsService.records(variables)))
          .subscribe((records) => (this.records = records))
      );
    },
  },
};
</script>

<style></style>
