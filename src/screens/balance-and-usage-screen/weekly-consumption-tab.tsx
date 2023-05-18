import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import BarGraph from '../../components/bar-graph';
import { ConsumptionContext } from '../../store/consumption-context';
import { UserContext } from '../../store/user-context';


export default function WeeklyConsumptionTab() {
  const consumptionCtx = useContext(ConsumptionContext);
  const userCtx = useContext(UserContext);
  const weeklyConsumption = consumptionCtx.weeklyConsumption;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {
        (typeof userCtx.userProfile.token === 'undefined' || weeklyConsumption!.length < 1) ?
          <ActivityIndicator size="large" /> :
          <BarGraph data={weeklyConsumption} />
      }
    </View>
  )
}
