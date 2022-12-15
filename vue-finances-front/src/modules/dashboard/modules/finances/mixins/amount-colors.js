export default {
  methods: {
    amountColor(amount) {
      return amount < 0
        ? "error--text text--darken-5"
        : "primary--text text--darken-5";
    },
  }
}