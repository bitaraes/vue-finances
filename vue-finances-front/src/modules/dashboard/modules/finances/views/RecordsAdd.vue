<template>
  <v-container>
    <v-layout class="text-center" row wrap>
      <v-flex xs12 sm6 md4 lg4>
        <NumericDisplay :color="color" v-model="$v.record.amount.$model" />
      </v-flex>
      <v-flex xs12 sm6 md8 lg8>
        <v-card>
          <v-card-text>
            <v-form>
              <v-dialog
                ref="dateDialog"
                v-model="showDateDialog"
                persistent
                width="290"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    name="date"
                    label="Vencimento"
                    prepend-icon="event"
                    type="text"
                    readonly
                    :value="formattedDate"
                    v-on="on"
                  ></v-text-field>
                </template>

                <v-date-picker
                  :color="color"
                  locale="pt-br"
                  scollable
                  v-model="dateDialogValue"
                ></v-date-picker>
                <v-spacer></v-spacer>
                <v-btn :color="color" @click="cancelDateDialog">
                  Cancelar
                </v-btn>
                <v-btn :color="color" @click="changeDate(dateDialogValue)">
                  OK
                </v-btn>
              </v-dialog>

              <v-select
                name="account"
                label="Conta"
                prepend-icon="account_balance"
                :items="accounts"
                item-text="description"
                item-value="id"
                v-model="$v.record.accountId.$model"
              ></v-select>

              <v-select
                name="category"
                label="Categoria"
                prepend-icon="class"
                :items="categories"
                item-text="description"
                item-value="id"
                v-model="$v.record.categoryId.$model"
              ></v-select>

              <v-text-field
                name="description"
                label="Descrição"
                prepend-icon="description"
                type="text"
                v-model.trim="$v.record.description.$model"
              ></v-text-field>

              <v-text-field
                v-show="showTagsInput"
                name="tags"
                label="Tags (Separadas por vírgula)"
                prepend-icon="label"
                type="text"
                v-model.trim="record.tags"
              >
              </v-text-field>

              <v-text-field
                v-show="showNotesInput"
                name="note"
                label="Observação"
                prepend-icon="note"
                type="text"
                v-model.trim="record.note"
              >
              </v-text-field>
            </v-form>

            <v-btn
              icon
              small
              class="mr-3"
              @click="showTagsInput = !showTagsInput"
            >
              <v-icon :color="color">label</v-icon>
            </v-btn>

            <v-btn icon small @click="showNotesInput = !showNotesInput">
              <v-icon :color="color">note</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
        <v-btn color="error" large class="mt-4" @click="$router.back()">
          <v-icon>close</v-icon>
        </v-btn>

        <v-btn :color="color" large class="mt-4" @click="submit()">
          <v-icon>check</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from "moment";
import { decimal, minLength, required } from "vuelidate/lib/validators";
import { mapActions } from "vuex";

import NumericDisplay from "./../components/NumericDisplay.vue";

import AccountsService from "./../services/accounts-service";
import CategoriesService from "./../services/categories-service";

export default {
  name: "RecordsAdd",
  components: {
    NumericDisplay,
  },
  data() {
    return {
      accounts: [],
      categories: [],
      dateDialogValue: moment().format("YYYY-MM-DD"),
      record: {
        type: this.$route.query.type.toUpperCase(),
        amount: 0,
        date: moment().format("YYYY-MM-DD"),
        accountId: "",
        categoryId: "",
        description: "",
        tags: "",
        note: "",
      },
      showDateDialog: false,
      showNotesInput: false,
      showTagsInput: false,
    };
  },
  validations: {
    record: {
      type: { required },
      amount: { required, decimal, different: (value) => value !== 0 },
      date: { required },
      accountId: { required },
      categoryId: { required },
      description: { required, minLength: minLength(6) },
    },
  },
  computed: {
    color() {
      switch (this.record.type) {
        case "CREDIT":
          return "primary";

        case "DEBIT":
          return "secondary";

        default:
          return "primary";
      }
    },
    formattedDate() {
      return moment(this.record.date).format("DD/MM/YYYY");
    },
  },
  async created() {
    this.changeTitle(this.$route.query.type);
    this.accounts = await AccountsService.accounts();
    this.categories = await CategoriesService.categories({
      operation: this.$route.query.type,
    });
  },
  async beforeRouteUpdate(to, from, next) {
    const { type } = to.query;
    this.changeTitle(type);
    this.record.type = type.toUpperCase();
    this.categories = await CategoriesService.categories({
      operation: type,
    });
    next();
  },
  methods: {
    ...mapActions(["setTitle"]),
    cancelDateDialog() {
      this.showDateDialog = false;
      this.dateDialogValue = this.record.date;
    },
    changeTitle(recordType) {
      let title;
      switch (recordType) {
        case "credit":
          title = "Nova Receita";
          break;

        case "debit":
          title = "Nova Despesa";
          break;

        default:
          title = "Novo lançamento";
      }
      this.setTitle({ title });
    },
    changeDate(value) {
      this.showDateDialog = false;
      this.record.date = value;
    },
    submit() {
      console.log(this.record);
    },
  },
};
</script>

<style></style>
