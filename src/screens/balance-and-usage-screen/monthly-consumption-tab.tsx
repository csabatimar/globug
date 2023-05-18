import React, { useContext } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import BarGraph from '../../components/bar-graph';
import { ConsumptionContext } from '../../store/consumption-context';
import { UserContext } from '../../store/user-context';


export default function MonthlyConsumptionTab() {
  const consumptionCtx = useContext(ConsumptionContext);
  const userCtx = useContext(UserContext);
  const monthlyConsumption = consumptionCtx.monthlyConsumption;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {
        (typeof userCtx.userProfile.token === 'undefined' || monthlyConsumption!.length < 1) ?
          <ActivityIndicator size="large" /> :
          <BarGraph data={monthlyConsumption} />
      }
    </View>
  )
}
