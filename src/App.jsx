import { useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash';


function App() {
  
  const inputRef = useRef();

  const [searchedUser, setSearchedUser] = useState('');
  const  [userData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersSet, setSelectedUsersSet] = useState(new Set());

  const fetchUsers = async () => {
    const res = await fetch(`https://dummyjson.com/users/search?q=${searchedUser}`);
    const data = await res.json();
    if (data && data.users) {
      setUserData(data.users);
    }
  }

  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 500), []);

  const handleChange = (e) => {
    setSearchedUser(e.target.value);
    debouncedFetchUsers(e.target.value)
  }

  // useEffect(() => {
  //   debounce(() => fetchUsers(), 1000);
  //   // fetchUsers();
  // }, [searchedUser]);

  const handleSelectedUser = (user) => {
    setSelectedUsers([...selectedUsers, { user }]);
    setSelectedUsersSet(new Set([...selectedUsersSet, user.email]));
    setSearchedUser('');
    setUserData([]);
  }

  const handleDelete = (user) => {
    const updatedUsers = selectedUsers.filter((users) => users.user.id !== user.user.id);
    setSelectedUsers(updatedUsers);

    const updatedUsersSet = new Set(selectedUsersSet);
    updatedUsersSet.delete(user.user.email);
    setSelectedUsersSet(updatedUsersSet)
  } 

  return (
    <div
      className='flex flex-wrap space-y-2 space-x-3 border border-gray-400 m-3 p-2 rounded-lg relative'
      onClick={() => inputRef.current.focus()}
    >
      {/* pills */}
      {
        selectedUsers.length > 0 &&
        selectedUsers.map((user) => (
          <span key={user?.user?.id} className='flex items-center space-x-1 bg-black rounded-full text-white p-2 w-fit'>
            <img className='h-[20px]' src={user?.user?.image} />
            <span>{user?.user?.firstName} {user?.user?.lastName}</span>
            <span className='cursor-pointer' onClick={() => handleDelete(user)}>x</span>
          </span>
        ))
      }
      {/* input */}
      <input type='text' placeholder='Search for a user' className='p-1 outline-none' value={searchedUser} onChange={handleChange} ref={inputRef} />
      {
        searchedUser !== '' &&
        <ul className='top-10 border border-gray-400 rounded-md max-h-[300px] p-5 space-y-2 absolute overflow-y-auto bg-white'>
        {
              userData?.map((user) => {
                return !selectedUsersSet.has(user.email) && (<>
                  <li key={user?.user?.id} className='cursor-pointer flex items-center space-x-2' onClick={() => handleSelectedUser(user)}>
                    <img className='h-[25px]' src={user?.image} alt={user?.firstName} />
                    <span>{user?.firstName} {user?.lastName}</span>
                  </li>
                  <hr />
                </>)
              })
        }
      </ul>
      }
    </div>
  )
}

export default App
