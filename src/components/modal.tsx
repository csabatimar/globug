import React, { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { mainTheme, palette } from "../theme/main-theme";
import { AppHeader1Text } from "./app-text";
import CustomButton from "./custom-button";


interface Props {
  header: string;
  message: string;
  buttonText: string;
  isVisible: boolean;
  cancel?: boolean;
  cancelHandler?: () => void;
  onPressProp: () => void;
}

export default function ModalComponent(
  { header, message, buttonText, isVisible, cancel, cancelHandler, onPressProp }: Props
){
  const [modalVisible, setModalVisible] = useState(isVisible);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{marginTop: 20}} />
            <AppHeader1Text>{header}</AppHeader1Text>
            <Text style={styles.modalText}>{message}</Text>
            <View style={styles.row}>
              { cancel && ( 
                <View style={{flex: 2}}> 
                  <CustomButton
                    accessibilityLabel='Cancel'
                    isValidated={true}
                    buttonTitle='Cancel'
                    submitPressHandler={cancelHandler!}
                    styleProp={{padding: 15, backgroundColor: palette.white,
                      alignItems: 'center',borderWidth: 1, borderColor: palette.gray               
                    }}
                  />
                </View>
              )}
              <View style={{flex: cancel ? 2 : 1}}>
                <CustomButton
                  accessibilityLabel=''
                  isValidated={true}
                  buttonTitle={buttonText}
                  submitPressHandler={onPressProp}
                  styleProp={{padding: 15, backgroundColor: palette.lightBlue,
                    alignItems: 'center', borderWidth: 1, borderColor: palette.gray
                    }}
                  />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.25,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalView: {
    width: '85%',
    backgroundColor: "white",
    borderRadius: 6,
    alignItems: "center",
    shadowOpacity: 0.25,
    overflow: "hidden"
  },

  modalText: {
    fontSize: mainTheme.fontSize.bodySmall,
    padding: 30,
    textAlign: 'center',
  },

  row: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.lightGray // the white button pressed BG
  }
});