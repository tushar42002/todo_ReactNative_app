import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const height = Dimensions.get('window').height;

const App = () => {

  const initialState = {
    id: 0,
    title: '',
    description: '',
    completed: false
  }


  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState(initialState);
  const [showModal, setShowModal] = useState(false);

  const getTodos = async () => {
    const todos = await AsyncStorage.getItem('todo');
    setTodo(JSON.parse(todos) ? JSON.parse(todos) : [])
    console.log(todos);
  }

  useEffect(() => {
    getTodos();
  }, [])

  const clear = () => setNewTodo(initialState);

  const addTodo = () => {
    if (!newTodo.title || !newTodo.description) {
      alert('plese enter all the details.')
      return;
    }

    newTodo.id = Date.now();
    const updateTodo = [...todo, newTodo];

    setTodo(updateTodo);

    AsyncStorage.setItem('todo', JSON.stringify(updateTodo));
    setShowModal(false)
    clear();
    console.log(todo);
  };

  const updateTodo = item => {
    const itemToBeUpdated = todo.filter(todoItem => todoItem.id == item.id);
    itemToBeUpdated[0].completed = !itemToBeUpdated[0].completed;

    const remainingItem = todo.filter(todoItem => todoItem.id != item.id);
    const updateTodo = [...itemToBeUpdated, ...remainingItem];

    setTodo(updateTodo);
    AsyncStorage.setItem('todo', JSON.stringify(updateTodo));
  }

  const DeleteTodo = item => {
    const itemToBedeleted = todo.filter(todoItem => todoItem.id != item.id);
    const updateTodo = [...itemToBedeleted];

    setTodo(updateTodo);
    AsyncStorage.setItem('todo', JSON.stringify(updateTodo));
  }

  const displayTodo = (item) => {

    return (<TouchableOpacity key={item.id}
      onPress={() => Alert.alert(`${item.title}`, `${item.description}`, [
        {
          text: item.completed ? 'Mark InProgress' : 'Mark Completed',
          onPress: () => updateTodo(item),
        },
        {
          text: 'delete',
          onPress: () => DeleteTodo(item),
        },
        {
          text: 'ok',
          style: 'cancel'
        }
      ])}
      style={{
        display: 'flex', flexDirection: 'row', paddingVertical: 10, borderBottomColor: '#000', borderBottomWidth: 1

      }} >
      <BouncyCheckbox isChecked={item.completed ? true : false} fillColor='blue' onPress={() => updateTodo(item)} />
      <Text style={{
        color: '#000', fontSize: 16, width: '90%',
        textDecorationLine: item.completed ? 'line-through' : 'none'
      }}>{item.title}</Text>
    </TouchableOpacity>)
  }

  const handleChange = (title, value) => {
    setNewTodo({ ...newTodo, [title]: value });
  }

  return (
    <View style={{ backgroundColor: '#fff' }}>
      <View>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, borderBottomWidth:1 }}>
          <Text style={{ color: '#000', fontSize: 25, fontWeight: '600', textTransform: 'uppercase', marginHorizontal: 20 }}>{todo.length} {todo.length == 1 ? 'task' : 'tasks'}</Text>
          <Text style={{ color: '#000', fontSize: 25, fontWeight: '600', textTransform: 'uppercase', marginHorizontal: 20 }}>Tushar</Text>

        </View>

        <View style={{ marginHorizontal: 20}}>

          <View>
            <Text style={{ color: '#111', textTransform: 'capitalize', paddingVertical: 20, fontSize:20 }}>task 📝</Text>
            <View style={{ height: 250 }}>
              <ScrollView>
                <View>

                  {
                    
                    todo.map(item => !item.completed ? displayTodo(item) : null)
                  }
                </View>
              </ScrollView>
            </View>
          </View>
          <View>
            <Text style={{ color: '#111', textTransform: 'capitalize', paddingVertical: 20, fontSize:20 }}>completed ✅</Text>
            <ScrollView>
              <View style={{ height: 250 }}>
                {
                  todo.map(item => item.completed ? displayTodo(item) : null)
                }
              </View>
            </ScrollView>
          </View>

        </View>

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          position: 'absolute',
          top: height - 100,
          right: 10
        }}>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 60,
              backgroundColor: '#000',
              borderRadius: 100
            }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>+</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showModal} animationType='slide' onRequestClose={() => setShowModal(false)}>

          <View style={{ marginVertical: 20, padding: 10 }}>
            <Text style={{ marginVertical: 20, color: '#000', fontSize: 25, fontWeight: '600' }}>Add to do Item</Text>

            <TextInput placeholder='Title' value={newTodo.title} onChangeText={(title) => handleChange('title', title)} style={{
              backgroundColor: 'rgb(220,220,220)', borderRadius: 10, paddingHorizontal: 10, marginVertical: 10, color: '#000'
            }} />

            <TextInput placeholder='Title' value={newTodo.description} onChangeText={(desc) => handleChange('description', desc)} style={{
              backgroundColor: 'rgb(220,220,220)', borderRadius: 10, paddingHorizontal: 10, marginVertical: 10, color: '#000'
            }}
              multiline={true}
              numberOfLines={6}
            />

            <View style={{ width: '100%', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={addTodo}
                style={{ backgroundColor: '#000', width: 100, borderRadius: 10, alignItems: 'center', padding: 10 }}>
                <Text style={{ color: '#fff', fontSize: 22 }}>Add</Text>
              </TouchableOpacity>
            </View>


          </View>

        </Modal>

      </View>
    </View>
  )
}

export default App