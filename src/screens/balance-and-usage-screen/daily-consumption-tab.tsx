import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import BarGraph from '../../components/bar-graph';
import { ConsumptionContext } from '../../store/consumption-context';
import { UserContext } from '../../store/user-context';


export default function DailyConsumptionTab() {
  const consumptionCtx = useContext(ConsumptionContext);
  const dailyConsumption = consumptionCtx.dailyConsumption;
  const userCtx = useContext(UserContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {
        (typeof userCtx.userProfile.token === 'undefined' || dailyConsumption!.length < 1) ?
          <ActivityIndicator size="large" /> :
          <BarGraph data={dailyConsumption} />
      }
    </View>
  )
}
