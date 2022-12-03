import React, { useEffect, useState, useRef } from "react";
import { Dropdown, Modal, Loader } from "../components";
import styles from './home.module.css'
import { db } from "../config/firebase-config";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
  orderBy,
  startAfter,
  setDoc,
  doc,
} from "firebase/firestore";
import { generatordata } from "../config/generatordata.js";
import InfiniteScroll from "react-infinite-scroll-component";

const options = [
  { label: "nombre", value: 1 },
  { label: "razon_social", value: 2 },
  { label: "nit", value: 3 },
  { label: "telefono", value: 4 },
  { label: "codigo", value: 5 },
];

const Home = () => {
  const ref = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [lastKey, setLastKey] = useState("");
  const [valueText, setValueText] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotSearching, setIsNotSearching] = useState(true);

  const usersRef = collection(db, "users");

  const getData = async () => {
    setIsLoading(true);
    const q = query(usersRef, orderBy("uid_user"), limit(20));
    const querySnapshop = await getDocs(q);
    querySnapshop.forEach((doc) => {
      console.log(doc.data().uid_user);
      setLastKey(doc.data().uid_user);
      setData((prevState) => [...prevState, doc.data()]);
    });
    setIsLoading(false);
  };

  const nextData = async () => {
    setIsLoading(true);
    const q = query(
      usersRef,
      orderBy("uid_user"),
      startAfter(lastKey),
      limit(20)
    );

    const querySnapshop = await getDocs(q);
    querySnapshop.forEach((doc) => {
      if (doc.data().uid_user) {
        setLastKey(doc.data().uid_user);
        setData((prevState) => [...prevState, doc.data()]);
      }
    });
    setIsLoading(false);
  };
  // // console.log(data)
  // const settData = async () => {
  //   const query = await generatordata.map((item) =>
  //     setDoc(doc(db, "users", item.codigo), {
  //       uid_user: item.uid_user,
  //       nombre: item.nombre,
  //       nit: item.nit,
  //       telefono: item.telefono,
  //       codigo: item.codigo,
  //       razon_social: item.razon_social,
  //     })
  //   );
  //   console.log(query);
  // };

  const searchQuery = async (q1) => {
    const querySnapshot = await getDocs(q1);
    if (!querySnapshot.empty) {
      setIsNotSearching(false);
      querySnapshot.forEach((doc) => {
        setData([]);
        setData([doc.data()]);
      });
    }
  };
  const submitSearch = async () => {
    console.log(valueText);
    if (searchText === "") {
      alert("ingrese texto");
    }
    if (valueText.length === 0) {
      alert("sin filtros");
    } else {
      valueText.map((value) => {
        if (value.label) {
          const q1 = query(usersRef, where(value.label, "==", searchText));
          searchQuery(q1);
        }
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <section>
      {/* <button onClick={() => nextData()}>add</button> */}
      {isLoading ? <Loader /> : null}
      <div className={styles.home__container} ref={ref}>
        <div className={styles['home__container-search']}>
          <Dropdown
            multiple
            options={options}
            value={valueText}
            onChange={(o) => {
              setValueText(o);
            }}
            onChangeInput={(o) => {
              setSearchText(o);
            }}
            inputValue={searchText}
            clearResult={() => {
              getData();
              setData([]);
              setSearchText("");
              setIsNotSearching(true);
            }}
          />
          <button
            className={styles.search__button}
            onClick={() => {
              submitSearch();
            }}
          >
            Buscar
          </button>
        </div>
        <div className={styles["home__container-body"]}>
          <div className={styles.body__table}>
            <InfiniteScroll
              dataLength={data.length}
              next={nextData}
              hasMore={isNotSearching}
              // loader={<h1>loading...</h1>}
            >
              <table>
                <thead>
                  <tr>
                    <th>Nro</th>
                    <th>Nombre</th>
                    <th>Razón Social</th>
                    <th>NIT</th>
                    <th>Teléfono</th>
                    <th>Código</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user, i) => {
                    const { nombre, razon_social, nit, telefono, codigo } =
                      user;
                    return (
                      <tr
                        onClick={() => {
                          setModalIsOpen(true);
                          setCurrentUser(user);
                          console.log(currentUser);
                        }}
                        key={i}
                      >
                        <td>{i + 1}</td>
                        <td>{nombre}</td>
                        <td>{razon_social}</td>
                        <td>{nit}</td>
                        <td>{telefono}</td>
                        <td>{codigo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </InfiniteScroll>
          </div>
          <div className={styles.body__side}></div>
        </div>
      </div>
      {modalIsOpen ? (
        <Modal
          setModalIsOpen={() => setModalIsOpen()}
          currentUser={currentUser}
          clearResult={() => {
            getData();
            setData([]);
          }}
        />
      ) : null}
    </section>
  );
};

export default Home;
