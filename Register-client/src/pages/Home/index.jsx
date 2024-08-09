import { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import "./style.css";
import api from "../../services/api";
import { toast } from "react-toastify";

function Home() {
  const [users, setUsers] = useState([]);

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  async function getUsers() {
    const response = await api.get("/users");
    setUsers(response.data);
  }

  useEffect(() => {
    getUsers();
  }, []);

  async function createUsers() {
    if (
      !inputName.current.value ||
      !inputAge.current.value ||
      !inputEmail.current.value
    ) {
      return toast.error("Por favor preencher os campos");
    } else if (inputName.current.value.match(/@|\\|\.|\//g) != null) {
      return toast.error(
        "Simbolos inválidos, Por favor digitar um nome válido."
      );
    }

    const response = await api.post("/users", {
      name: inputName.current.value,
      age: parseInt(inputAge.current.value), //changing int type to send inputAge to API
      email: inputEmail.current.value,
    });

    if (response.status == 201) {
      setUsers([...users, response.data]);
      toast.success("Usuário criado com sucesso!");
    }

    inputName.current.value = "";
    inputAge.current.value = "";
    inputEmail.current.value = "";
  }

  async function deleteUsers(id) {
    const response = await api.delete(`/users/${id}`);
    if (response.status == 204) {
      setUsers((users) => users.filter((user) => user.id != id));
      toast.success("Usuário deletado com sucesso!");
    }
    //filter if user.id is different to id request
  }

  return (
    <div className="container">
      <form>
        <h1>Cadastro de Usuários</h1>
        <input placeholder="Nome" name="name" type="text" ref={inputName} />
        <input placeholder="Idade" name="age" type="number" ref={inputAge} />
        <input placeholder="Email" name="email" type="email" ref={inputEmail} />
        <button onClick={createUsers} type="button">
          Cadastrar
        </button>
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>
              Nome: <span>{user.name}</span>
            </p>
            <p>
              Idade: <span>{user.age}</span>
            </p>
            <p>
              Email: <span>{user.email}</span>
            </p>
          </div>
          <button onClick={() => deleteUsers(user.id)}>
            <Icon icon="ph:trash-bold" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
