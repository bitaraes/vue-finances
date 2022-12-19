import apollo from "@/plugins/apollo";
import moment from "moment";
import { from } from "rxjs";
import { map } from "rxjs/operators"

import RecordCreateMutation from "./../graphql/RecordCreate.gql";
import RecordsQuery from "./../graphql/Records.gql";
import TotalbalanceQuery from "./../graphql/TotalBalance.gql";

const createRecord = async variables => {
  const response = await apollo.mutate({
    mutation: RecordCreateMutation,
    variables,
    update: (proxy, {data: {createRecord}}) => {
      const month = moment(createRecord.date.substr(0,10)).format('MM-YYYY');
      const variables = { month };
      try {
        const recordsData = proxy.readQuery({
          query: RecordsQuery,
          variables
        })

        recordsData.records = [...recordsData.records, createRecord];

        proxy.writeQuery({
          query: RecordsQuery,
          variables,
          data: recordsData
        })

      } catch (error) {
        console("This query has not been read yet!", error)
      }

      try {
        const currentDate = moment().endOf('day');
        const recordDate = moment(createRecord.date.substr(0,10));
        const variables = { date: currentDate.format('YYYY-MM-DD')};

        if(recordDate.isBefore(currentDate)) {
          const totalBalanceData = proxy.readQuery({
            query: TotalbalanceQuery,
            variables
          })

          totalBalanceData.totalBalance = +(totalBalanceData.totalBalance + createRecord.amount).toFixed(2);

          proxy.writeQuery({
            query: TotalbalanceQuery,
            variables,
            data: totalBalanceData,
          })
        }
      } catch (error) {
          console("This query has not been read yet!", error)
      }
    },
  });
  return response.data.createRecord;
};

const records = variables => {
  const queryRef = apollo.watchQuery({
    query: RecordsQuery,
    variables
  });
  return from(queryRef).pipe(
    map(res => res.data.records)
  );
};

const totalBalance = async () => {
  const response = await apollo.query({
    query: TotalbalanceQuery,
    variables: {
      date: moment().format('YYYY-MM-DD')
    }
  });
  return response.data.totalBalance;
};

export default {
  createRecord,
  records,
  totalBalance,
}