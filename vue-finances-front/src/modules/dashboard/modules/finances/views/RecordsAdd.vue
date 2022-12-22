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
              >
                <v-list-item slot="prepend-item" ripple @click="add('account')">
                  <v-list-item-action>
                    <v-icon>add</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Adicionar Conta</v-list-item-title>
                </v-list-item>
                <v-divider slot="prepend-item" class="mt-2"></v-divider>
              </v-select>

              <v-select
                name="category"
                label="Categoria"
                prepend-icon="class"
                :items="categories"
                item-text="description"
                item-value="id"
                v-model="$v.record.categoryId.$model"
              >
                <v-list-item
                  slot="prepend-item"
                  ripple
                  @click="add('category')"
                >
                  <v-list-item-action>
                    <v-icon>add</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Adicionar Categoria</v-list-item-title>
                </v-list-item>
                <v-divider slot="prepend-item" class="mt-2"></v-divider>
              </v-select>

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

        <v-btn
          :color="color"
          large
          class="mt-4"
          @click="submit()"
          :disabled="$v.$invalid"
        >
          <v-icon>check</v-icon>
        </v-btn>
        <v-dialog v-model="showAccountCategoryDialog" max-width="350">
          <AccountCategoryAdd
            v-if="showAccountCategoryDialog"
            :entity="entity"
            @close="showAccountCategoryDialog = false"
            @saved="accountCategorySaved"
          />
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from "moment";
import { decimal, minLength, required } from "vuelidate/lib/validators";
import { mapActions } from "vuex";

import AccountCategoryAdd from "../components/AccountCategoryAdd.vue";
import NumericDisplay from "./../components/NumericDisplay.vue";

import AccountsService from "./../services/accounts-service";
import CategoriesService from "./../services/categories-service";
import RecordsService from "../services/records-service";
import { Subject } from "rxjs";
import { mergeMap, distinctUntilChanged } from "rxjs/operators";

export default {
  name: "RecordsAdd",
  components: {
    NumericDisplay,
    AccountCategoryAdd,
  },
  data() {
    return {
      accounts: [],
      categories: [],
      dateDialogValue: moment().format("YYYY-MM-DD"),
      entity: "",
      operationSubject$: new Subject(),
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
      showAccountCategoryDialog: false,
      showDateDialog: false,
      showNotesInput: false,
      showTagsInput: false,
      subscriptions: [],
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
    this.subscriptions.push(
      AccountsService.accounts().subscribe(
        (accounts) => (this.accounts = accounts)
      )
    );

    this.subscriptions.push(
      this.operationSubject$
        .pipe(
          distinctUntilChanged(),
          mergeMap((operation) => CategoriesService.categories({ operation }))
        )
        .subscribe((categories) => (this.categories = categories))
    );

    this.operationSubject$.next(this.$route.query.type);
  },
  async beforeRouteUpdate(to, from, next) {
    const { type } = to.query;
    this.changeTitle(type);
    this.record.type = type.toUpperCase();
    this.record.categoryId = "";
    this.operationSubject$.next(type);
    next();
  },
  destroyed() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  },
  methods: {
    ...mapActions(["setTitle"]),
    accountCategorySaved(item) {
      this.showAccountCategoryDialog = false;
      this.record[`${this.entity}Id`] = item.id;
    },
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
    async submit() {
      try {
        const record = await RecordsService.createRecord(this.record);
        console.log(record);
        this.$router.push({ path: "/dashboard/records" });
      } catch (error) {
        console.log("Error creating record: ", error);
      }
    },
    add(entity) {
      this.showAccountCategoryDialog = true;
      this.entity = entity;
    },
  },
};
</script>

<style></style>
