import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const URL = 'http://localhost/shoppinglistBack/';

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({
    description:'',
    amount:''
  });
  
  
  
  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data)
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
    
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    setItem({
      ...item,
      [e.target.name]: value
    });
  }

  function add(e) {
    e.preventDefault();

    const json = JSON.stringify(item)
    
    axios.post(URL + 'add.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        setItems(items => [...items,response.data]);
        setItem('');
         
      }).catch (error => {
        alert(error.response.data.error)
      });
  }

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php',json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      const newListWithoutRemoved = items.filter((item) => item.id !== id);
      setItems(newListWithoutRemoved);
    }).catch (error => {
      alert(error.response ? error.response.data.error : error);
    })
  }
  

  return (
    <div className="container">
      <h2>Shopping list</h2>
      <form onSubmit={add}>
        <label>New item</label>
        <input name='description' value={item.description} placeholder='type description' onChange={handleChange} />
        <input name='amount' value={item.amount} placeholder='type amount' onChange={handleChange} />
        <button>Add</button>
      </form>
      <ul>
        {items?.map(item => (
          <li key={item.id}>{item.description}&nbsp;{item.amount}&nbsp;
          <a href="#" className='delete' onClick={() => remove(item.id)}>Delete</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

