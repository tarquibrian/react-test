import React, { useEffect, useState } from "react";
import styles from "./modal.module.css";
import { doc, setDoc, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";

const initForm = {
  nombre: "",
  nit: "",
  razon_social: "",
  telefono: "",
  codigo: "",
};

const Modal = ({ setModalIsOpen, currentUser, clearResult }) => {
  const [formValues, setFormValues] = useState(initForm);
  const { nombre, nit, razon_social, telefono, codigo } = formValues;
  useEffect(() => {
    if (currentUser) {
      setFormValues(currentUser);
    } else {
      setFormValues(initForm);
    }
  }, []);

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      await setDoc(doc(db, "users", formValues.codigo), {
        nombre: formValues.nombre,
        nit: formValues.nit,
        razon_social: formValues.razon_social,
        telefono: formValues.telefono,
        codigo: formValues.codigo,
      });
      setModalIsOpen(false);
    } else {
      await updateDoc(doc(db, "users", currentUser.codigo), {
        nombre: formValues.nombre,
        nit: formValues.nit,
        razon_social: formValues.razon_social,
        telefono: formValues.telefono,
        codigo: formValues.codigo,
      });
      setModalIsOpen(false);
    }
  };

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.modal__inner}>
          <button
            className={styles.modal__close}
            for="modal-1"
            onClick={() => setModalIsOpen(false)}
          ></button>

          {currentUser ? <h2>Actualizar Usuario</h2> : <h2>Agregar usuario</h2>}
          <form onSubmit={handleSubmit} className={styles.modal__form}>
            <input
              type="text"
              name="nombre"
              id="displayName"
              placeholder="Nombre"
              onChange={handleInputChange}
              value={nombre}
            />
            <input
              type="text"
              name="razon_social"
              id="displayName"
              placeholder="Razón Social"
              value={razon_social}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="nit"
              id="displayName"
              placeholder="NIT"
              value={nit}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="telefono"
              id="displayName"
              placeholder="Teléfono"
              value={telefono}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="codigo"
              id="displayName"
              placeholder="Código"
              value={codigo}
              onChange={handleInputChange}
            />
            {currentUser ? (
              <button type="submit" onClick={() => clearResult()}>
                Actualizar
              </button>
            ) : (
              <button type="submit" onClick={() => clearResult()}>
                Agregar
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Modal;
