import apollo from "@/plugins/apollo";
import moment from "moment";

import RecordsQuery from "./../graphql/Records.gql";
import TotalbalanceQuery from "./../graphql/TotalBalance.gql";

const records = async variables => {
  const response = await apollo.query({
    query: RecordsQuery,
    variables
  });
  return response.data.records;
}

const totalBalance = async () => {
  const response = await apollo.query({
    query: TotalbalanceQuery,
    variables: {
      date: moment().format('YYYY-MM-DD')
    }
  });
  return response.data.totalBalance;
}

export default {
  records,
  totalBalance,
}