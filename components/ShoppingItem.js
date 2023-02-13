import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import CheckBox from "./CheckBox";
import { MaterialIcons } from "@expo/vector-icons";
import { db, doc, deleteDoc, updateDoc } from "../firebase/index";
import { EvilIcons, Entypo } from "@expo/vector-icons";
import { setDoc } from "firebase/firestore";
import { decrement } from "../src/features/counter/counterSlice";
import {useSelector, useDispatch } from "react-redux";

const ShoppingItem = (props) => {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()
  const [isChecked, setIsChecked] = useState(props.isChecked);
  const [shoppingList, setShoppingList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [newName, setnewName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newOfferPrice, setNewOfferPrice] = useState("");
  // unique id for each smartphone
  const [uniqueId, setUniqueId] = useState("");
  const [UpdateModalVisible, setUpdateModalVisible] = useState(false);
  // delete specific item
  const deleteShoppingItem = async () => {
    await deleteDoc(doc(db, "Shopping", props.id)).then(() => {
      if (Platform.OS === "android") {
        ToastAndroid.show(`${props.title} removed`, ToastAndroid.SHORT);
      }
      props.onRefresh();
      dispatch(decrement())
    })
  };
  const openModalUpdate = () => {
    setUpdateModalVisible(true);
  };
  // update specific item
  const updateShoppingItem = async () => {
    try {
      const special = doc(db, `Shopping/${props.id}`);
      //   console.log(`Shopping/${props.id}`)
      const docData = {
        title: newName,
        image: newImage,
        price: newPrice,
        offerPrice: newOfferPrice,
        isChecked: false,
      };
      // updateDoc(special, docData);
      setDoc(special, docData, { merge: true });

      if (Platform.OS === "android") {
        ToastAndroid.show(`${newName} updated`, ToastAndroid.SHORT);
      }

      setnewName("");

      setNewImage("");
      setNewPrice("");
      setNewOfferPrice("");
      setUpdateModalVisible(false);
      setTimeout(() => {
        props.onRefresh();
      }, 500);
    } catch (e) {
      console.error("Error updating the document");
    }
  };

  // update isChecked property
  const updateIsChecked = async () => {
    await updateDoc(doc(db, "Shopping", props.id), {
      isChecked: isChecked,
    });
  };

  // call function whenever isChecked property change
  useEffect(() => {
    updateIsChecked();
  }, [isChecked]);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={UpdateModalVisible}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#050504",
              alignItems: "center",
              padding: 20,
              width: "100%",
              alignSelf: "center",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              height: "80%",
            }}
          >
            {/* close modal button */}
            <Pressable
              style={{
                alignSelf: "flex-end",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setUpdateModalVisible(false)}
            >
              <EvilIcons name="close-o" size={30} color="#D8E9A8" />
            </Pressable>

            {/* textinput for new otem */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  width: "20%",
                  textAlign: "center",
                }}
              >
                Name
              </Text>
              <TextInput
                placeholder="add name"
                value={newName}
                onChangeText={(text) => setnewName(text)}
                // onSubmitEditing={addShoppingItem}
                style={styles.input}
                autoFocus
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  width: "20%",
                  textAlign: "center",
                }}
              >
                Image
              </Text>
              <TextInput
                placeholder="add image"
                value={newImage}
                onChangeText={(text) => setNewImage(text)}
                // onSubmitEditing={addShoppingItem}
                style={styles.input}
                autoFocus
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  width: "20%",
                  textAlign: "center",
                }}
              >
                Price
              </Text>
              <TextInput
                placeholder="add price"
                value={newPrice}
                onChangeText={(text) => setNewPrice(text)}
                // onSubmitEditing={addShoppingItem}
                style={styles.input}
                autoFocus
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  width: "20%",
                  textAlign: "center",
                }}
              >
                Offer Price
              </Text>
              <TextInput
                placeholder="add offer price"
                value={newOfferPrice}
                onChangeText={(text) => setNewOfferPrice(text)}
                // onSubmitEditing={addShoppingItem}
                style={styles.input}
                autoFocus
              />
            </View>
            {/* add button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                updateShoppingItem();
                setUpdateModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* checkbox component */}
      <CheckBox
        isChecked={isChecked}
        onPress={() => setIsChecked(!isChecked)}
      />
      {/* title */}
      <Text
        style={[
          styles.title,
          {
            textDecorationLine: isChecked ? "line-through" : "none",
            color: isChecked ? "#D8E9A8" : "#fff",
          },
        ]}
      >
        {props.title}
      </Text>
      <Pressable style={styles.delete} onPress={openModalUpdate}>
        <MaterialIcons name="update" size={24} color="#FF6768" />
      </Pressable>
      {/* delete button */}
      <Pressable style={styles.delete} onPress={deleteShoppingItem}>
        <MaterialIcons name="delete" size={24} color="#FF6768" />
      </Pressable>
    </View>
  );
};

export default ShoppingItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#282828",
    width: "90%",
    borderRadius: 10,
    padding: 13,
    alignItems: "center",
    marginTop: 15,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    flex: 1,
    fontWeight: "500",
  },
  delete: {
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  infoContainer: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 200,
    opacity: 0.5,
  },
  buttonContainer: {},
  input: {
    backgroundColor: "#fff",
    padding: 8,
    fontSize: 15,
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#D8E9A8",
    padding: 10,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 17,
    color: "#000",
  },
});
