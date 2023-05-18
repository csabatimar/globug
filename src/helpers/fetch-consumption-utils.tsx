import * as DateFNs from 'date-fns';
import { getConsumptionHistory } from '../api/globug-api';


export async function dailyConsumption(token: string, days = 90) { // 400 in the old app
  const endDate = new Date();
  let startDate = new Date();
  startDate.setTime(endDate.getTime() - (days * 24 * 3600000));
  const frequency = 'DAILY'

  const result = await getConsumptionHistory({ token, startDate, endDate, frequency }) as any;

  const combinedData = result.transactions.map((transaction: any) => {
    const cap = result.caps.find(
      (cap: any) => cap.startDate === transaction.startDate
    );
    return {
      ...transaction,
      capAmount: cap ? cap.capAmount : 0,
    };
  });

  return combinedData.map((i: any) => ({
      date: new Date(i.startDate),
      label: DateFNs.format(new Date(i.startDate), 'dd/MM'),
      usageDollars: i.totalUsageCost || 0,
      capAmount: i.capAmount || 0,
    })).reverse();

  // return result.map((i: any) => ({
  //   date: new Date(i.startDate),
  //   label: DateFNs.format(new Date(i.startDate), 'dd/MM'),
  //   usageDollars: i?.totalUsageCost || 0
  // })).reverse();
}

export async function weeklyConsumption(token: string) {
  const endDate = new Date();
  let startDate = new Date();
  startDate.setTime(endDate.getTime() - ((endDate.getDay() - 1 + 52 * 7) * 24 * 3600000)); // 52 weeks
  const frequency = 'WEEKLY';

  const result = await getConsumptionHistory({ token, startDate, endDate, frequency }) as any;

  // The following might be useful in the future if cap data is used not only in DAILY graphs

  // const combinedData = result.transactions.map((transaction: any) => {
  //   const cap = result.caps.find(
  //     (cap: any) => cap.startDate === transaction.startDate
  //   );
  //   return {
  //     ...transaction,
  //     capAmount: cap ? cap.capAmount : 0,
  //   };
  // });

  // return combinedData.map((i: any) => ({
  //   date: new Date(i.startDate),
  //   label: `${DateFNs.format(new Date(i.startDate), 'dd')}-${DateFNs.format(
  //     new Date(i.endDate), 'dd')} ${DateFNs.format(new Date(i.endDate), 'MMM')}`,
  //   usageDollars: i?.totalUsageCost || 0,
  //   capAmount: i.capAmount || 0,
  // })).reverse();

  return result.transactions.map((i: any) => ({
    date: new Date(i.startDate),
    label: `${DateFNs.format(new Date(i.startDate), 'dd')}-${DateFNs.format(
      new Date(i.endDate), 'dd')} ${DateFNs.format(new Date(i.endDate), 'MMM')}`,
    usageDollars: i?.totalUsageCost || 0
  })).reverse();
}

export async function monthlyConsumption(token: string, days = 450) { // 400 in the old app
  const endDate = new Date();
  let startDate = new Date();
  startDate.setTime(endDate.getTime() - (days * 24 * 3600000));
  const frequency = 'MONTHLY'

  const result = await getConsumptionHistory({ token, startDate, endDate, frequency })as any;
  
  // The following might be useful in the future if cap data is used not only in DAILY graphs
  // const combinedData = result.transactions.map((transaction: any) => {
  //   const cap = result.caps.find(
  //     (cap: any) => cap.startDate === transaction.startDate
  //   );
  //   return {
  //     ...transaction,
  //     capAmount: cap ? cap.capAmount : 0,
  //   };
  // });

  // return combinedData.map((i: any) => ({
  //   date: new Date(i.startDate),
  //   label: DateFNs.format(new Date(i.startDate), 'MMM yyyy'),
  //   usageDollars: i?.totalUsageCost || 0,
  //   capAmount: i.capAmount || 0,
  // })).reverse();

  return result.transactions.map((i: any) => ({
    date: new Date(i.startDate),
    label: DateFNs.format(new Date(i.startDate), 'MMM yyyy'),
    usageDollars: i?.totalUsageCost || 0
  })).reverse();
}
