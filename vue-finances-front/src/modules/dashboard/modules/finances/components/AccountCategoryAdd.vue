<template>
  <v-card>
    <v-card-title class="headline">
      {{ title }}
    </v-card-title>
    <v-card-text>
      <v-text-field
        label="Descrição"
        v-model="$v.item.description.$model"
      ></v-text-field>
      <v-select
        v-if="entity === 'category'"
        label="Operação"
        v-model="$v.item.operation.$model"
        :items="operations"
        item-text="description"
        item-value="value"
      >
      </v-select>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('close')">Cancelar</v-btn>
      <v-btn color="primary" @click="save" :disabled="$v.$invalid">
        Salvar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";

import AccountsService from "../services/accounts-service";
import CategoriesService from "../services/categories-service";

export default {
  name: "AccountCategoryAdd",
  props: {
    entity: String,
  },
  data() {
    return {
      item: {
        description: "",
        operation: this.$route.query.type.toUpperCase(),
      },
      operations: [
        { description: "Despesa", value: "DEBIT" },
        { description: "Receita", value: "CREDIT" },
      ],
    };
  },
  validations() {
    const validations = {
      item: {
        description: {
          required,
          minLength: minLength(3),
        },
      },
    };

    if (this.entity === "account") {
      return validations;
    }

    return {
      item: {
        ...validations.item,
        operation: { required },
      },
    };
  },
  computed: {
    title() {
      return this.entity === "account" ? "Nova conta" : "Nova categoria";
    },
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    async save(e) {
      let promise;
      switch (this.entity) {
        case "account":
          promise = AccountsService.createAccount(this.item);
          break;
        case "category":
          promise = CategoriesService.createCategory(this.item);
          break;
      }

      const item = await promise;
      this.$emit("saved", item);
    },
  },
};
</script>

<style></style>
