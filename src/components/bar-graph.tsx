import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Dimensions } from 'react-native';
import { formatBalanceForBar } from '../helpers/utils';
import { mainTheme, palette } from '../theme/main-theme';
import { AppText } from './app-text';


const screenHeight = Dimensions.get('window').height;

function Item({ item, formattedValue, usageDollarsHeight, capAmountLinePosition = 0 }: any) {
  const isBarTooSmallForText = usageDollarsHeight < 18;

  return (
    <View style={{ alignItems: 'center' }}>
      {isBarTooSmallForText && (
        <Text
          style={{
            fontSize: mainTheme.fontSize.bodyXS,
            color: palette.black,
          }}>
          {formattedValue}
        </Text>
      )}
      <View style={{ }}>
        <View style={{ ...styles.usageDollarsBar, height: usageDollarsHeight, alignItems: 'center' }}>
        {isBarTooSmallForText === false && (
          <Text
            style={{
              ...styles.barText,
              paddingTop: 5,
            }}>
            {formattedValue}
          </Text>
        )}
        </View>
        {item.capAmount !== null && item.capAmount !== 0 && capAmountLinePosition !== 0 && (
          <React.Fragment>
            <View
              style={{
                position: 'absolute',
                bottom: capAmountLinePosition,
                left: 0,
                right: 0,
                borderBottomColor: palette.red,
                borderBottomWidth: 2,
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: capAmountLinePosition - 2,
                left: '50%',
                width: 5,
                height: 5,
                backgroundColor: palette.red,
                borderRadius: 2.5,
                transform: [{ translateX: -4 }],
              }}
            />
          </React.Fragment>
        )}
      </View>
      {item.label.split(' ').map((s: string) => (
        <AppText key={s}>{s}</AppText>
      ))}
    </View>
  );
}

const viewabilityConfig = {
  minimumViewTime: 1,
  viewAreaCoveragePercentThreshold: 1,
};

export default function BarGraph({data}: any) {
  const [isLoading, setIsLoading] = useState(false);
  const barGraphHeight = useRef(screenHeight * 0.35);
  const [maxViewableDollarValue, setMaxViewableDollarValue] = useState(3);
  
  useEffect(() => {
    setIsLoading(true);
  
    (function () {
      if (data!.length > 1) {
        const MAX_INITIAL_VIEWABLE = 9;
        const size =
          (data.length < MAX_INITIAL_VIEWABLE) ? data.length : MAX_INITIAL_VIEWABLE;
        const InitialDataCopy = data.slice(0, size);

        setMaxViewableDollarValue(
          InitialDataCopy.reduce((acc: number, item: any) => {
            if ('capAmount' in item) {
              const biggerValue = (item.capAmount > item.usageDollars) ? 
                item.capAmount : item.usageDollars;
              return Math.max(acc, biggerValue);
            } 
            else {
              return Math.max(acc, item.usageDollars);
            }            
          }, 0)
        );        
      }
    })();
  
    setIsLoading(false);
  }, [data]);

  function onLayoutEvent({ nativeEvent }: any) {
    return nativeEvent.layout.height;
  }

  function scaleFn(item: any) {
    const margin = screenHeight * 0.1;

    let heightWithMargin: number = Number(barGraphHeight.current) - margin;

    return Math.round((item.usageDollars * heightWithMargin) / maxViewableDollarValue);
  }

  function setBouncedOffMaxViewableDollarValue(dollarValue: number) {
    // LayoutAnimation.easeInEaseOut(); //
    setMaxViewableDollarValue(dollarValue);
  }

  function onViewableItemsChanged({ viewableItems }: any) {
    if (typeof viewableItems !== 'undefined' && viewableItems.length > 0) {
      setBouncedOffMaxViewableDollarValue(
        viewableItems.reduce((acc: number, item: any) => {
          if ('capAmount' in item.item) {
            const biggerValue = (item.item.capAmount > item.item.usageDollars) ? 
              item.item.capAmount : item.item.usageDollars;
            return Math.max(acc, biggerValue);
          } else {
            return Math.max(acc, item.item.usageDollars);
          }
        }, 0)
      );      
    }
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const MemoizedFlatListItem = React.memo(({ item }: any) => {
    const formattedValue = `$${formatBalanceForBar(item.usageDollars)}`;
    const totalHeight = scaleFn({ usageDollars: maxViewableDollarValue });
    const usageDollarsHeight = (item.usageDollars / maxViewableDollarValue) * totalHeight;
    const capAmountLinePosition = item.capAmount ? 
      (item.capAmount / item.usageDollars) * usageDollarsHeight : 0
    ;
    const itemProps = { 
      item, 
      formattedValue, 
      totalHeight: usageDollarsHeight, 
      usageDollarsHeight, 
      capAmountLinePosition 
    };

    return <Item {...itemProps} />;
  });

  function renderFlatListItem({ item }: any) {
    return <MemoizedFlatListItem item={item} />;
  }  

  // Assuming all items have the same capAmount:
  const capAmount = 'capAmount' in data[0] ? data[0].capAmount : 0;

  const capAmountFormattedValue = (capAmount !== null && capAmount !== 0) ? 
    `$${formatBalanceForBar(capAmount)}` : ''
  ;

  return (
    <React.Fragment>
      {
        (typeof data === 'undefined' || data.length < 1 || isLoading) ?
          <View style={{ alignItems: 'center' }}><ActivityIndicator size="large" /></View> :
          (
            <View style={{ flex: 1 }} onLayout={onLayoutEvent}>
              <FlatList
                initialNumToRender={16}
                horizontal
                inverted
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={(item) => item.date.toISOString()}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                contentContainerStyle={{ alignItems: 'flex-end' }}
                renderItem={renderFlatListItem}
              />
              {capAmount !== null && capAmount !== 0 && (
                <Text
                  style={{
                    position: 'absolute',
                    top: screenHeight * 0.08,
                    left: '45%',
                    transform: [{ translateX: -50 }, { translateY: -50 }],
                    fontSize: mainTheme.fontSize.body,
                    color: palette.red,
                    zIndex: 100,
                  }}>
                  {`Cap Amount: ${capAmountFormattedValue}`}
                </Text>
              )}
            </View>
          )
      }
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  barText: {
    fontSize: mainTheme.fontSize.bodyXS,
    color: palette.white,
  },

  usageDollarsBar: {
    width: 40,
    height: 10,
    marginHorizontal: 4,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    backgroundColor: palette.lightBlue,
    borderColor: palette.dimGray,
    borderWidth: 1,
  },
});