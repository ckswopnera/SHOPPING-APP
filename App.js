import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  FlatList,
  ToastAndroid,
  Platform,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AddButton from "./components/AddButton";
import Header from "./components/Header";
import ShoppingItem from "./components/ShoppingItem";
import { EvilIcons, Entypo } from "@expo/vector-icons";
import {
  db,
  collection,
  getDocs,
  addDoc,
  doc,
  query,
  where,
  deleteDoc,
  updateDoc,
} from "./firebase/index";
import { LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdateButton from "./components/UpdateButton";
import { setDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { decrementAll, increment } from "./src/features/counter/counterSlice";
export default function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  // store entire list
  const [shoppingList, setShoppingList] = useState([]);
  // total items in the list
  const [totalItems, setTotalItems] = useState(0);

  // is modal visible or not for add new item
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  // new item string
  const [newName, setnewName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newOfferPrice, setNewOfferPrice] = useState("");
  // unique id for each smartphone
  const [uniqueId, setUniqueId] = useState("");

  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

  // generate new id if not already present
  const generateId = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id !== null) {
        setUniqueId(id);
        getShoppingList();
      } else {
        const newId = Math.random().toString();
        setUniqueId(newId);
        await AsyncStorage.setItem("id", uniqueId);
      }
    } catch (e) {
      // error reading value
    } finally {
    }
  };

  // get entire list
  const getShoppingList = async () => {
    const shoppingCol = query(
      collection(db, "Shopping"),
      where("uniqueId", "==", uniqueId)
    );
    const shoppingSnapshot = await getDocs(shoppingCol);
    setTotalItems(shoppingSnapshot.size);
    setShoppingList(
      shoppingSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  // delete entire list
  const deleteShoppingList = async () => {
    const shoppingCol = query(
      collection(db, "Shopping"),
      where("uniqueId", "==", uniqueId)
    );
    const shoppingSnapshot = await getDocs(shoppingCol);
    shoppingSnapshot.docs.map((item) => {
      deleteDoc(doc(db, "Shopping", item.id));
    });
    if (Platform.OS === "android") {
      ToastAndroid.show("All Items Deleted", ToastAndroid.SHORT);
    }
setTimeout(() => {
  getShoppingList();
}, 500);
   
    dispatch(decrementAll());
  };

  // add new item
  const addShoppingItem = async () => {
    try {
      const docRef = await addDoc(collection(db, "Shopping"), {
        title: newName,
        image: newImage,
        price: newPrice,
        offerPrice: newOfferPrice,
        isChecked: false,
        uniqueId: uniqueId,
      });
      if (Platform.OS === "android") {
        ToastAndroid.show(`${newName} added`, ToastAndroid.SHORT);
      }
      setModalVisible(false);
      getShoppingList();
      dispatch(increment());
      setnewName("");

      setNewImage("");
      setNewPrice("");
      setNewOfferPrice("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // open new item modal
  const openModal = () => {
    setModalVisible(true);
  };

  const _handleRefresh = () => {
    setRefresh(true);
    getShoppingList().then(setRefresh(false));
  };
  useEffect(() => {
    generateId();
    getShoppingList();
  }, [uniqueId]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          opacity: modalVisible ? 0.8 : 1,
        },
      ]}
    >
      <StatusBar style="light" />
      <View style={styles.infoContainer}>
        {/* header */}
        <Header
          total={totalItems}
          onAllList={getShoppingList}
          onDeleteAll={deleteShoppingList}
        />
        {/* list of items */}
        <FlatList
          data={shoppingList}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={_handleRefresh} />
          }
          renderItem={({ item }) => (
            <ShoppingItem
              id={item.id}
              title={item.title}
              isChecked={item.isChecked}
              onRefresh={getShoppingList}
            />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Entypo name="shopping-cart" size={150} color="#D8E9A8" />
            </View>
          }
          ListFooterComponent={<View style={{ height: 20 }}></View>}
        />
      </View>

      {/* modal for new item */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
              onPress={() => setModalVisible(false)}
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
            <Pressable style={styles.button} onPress={addShoppingItem}>
              <Text style={styles.buttonText}>Add</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* button to open the modal */}
      <View style={styles.buttonContainer}>
        <AddButton onPress={openModal} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#323232",
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
