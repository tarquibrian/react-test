import React, { useEffect, useRef, useState } from "react";
import styles from "./dropdown.module.css";
import Modal from "../Modal";

const Dropdown = ({
  multiple,
  options,
  value,
  onChange,
  inputValue,
  onChangeInput,
  clearResult,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);

  const [filterText, setFilterText] = useState();
  const handle = () => {
    console.log(filterText);
  };

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  function selectOption(option) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  }

  function isOptionSelected(option) {
    return multiple ? value.includes(option) : option === value;
  }

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    var _a;
    const handler = (e) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    (_a = containerRef.current) === null || _a === void 0
      ? void 0
      : _a.addEventListener("keydown", handler);
    return () => {
      var _a;
      (_a = containerRef.current) === null || _a === void 0
        ? void 0
        : _a.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <div>
      <div
        ref={containerRef}
        tabIndex={0}
        className={styles.container}
        onBlur={() => setIsOpen(false)}
      >
        <input
          className={styles}
          type="text"
          placeholder="Buscar"
          onChange={(e) => onChangeInput(e.target.value)}
          value={inputValue}
        />
        <span className={styles.value}>
          {multiple
            ? value.map((v) => (
                <button
                  key={v.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectOption(v);
                  }}
                  className={styles["option-badge"]}
                >
                  {v.label}

                  <span className={styles["remove-btn"]}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-circle-minus"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <circle cx="12" cy="12" r="9"></circle>
                      <line x1="9" y1="12" x2="15" y2="12"></line>
                    </svg>
                  </span>
                </button>
              ))
            : value?.label}
        </span>

        <div className={styles.searchOptions}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearOptions();
              clearResult();
            }}
            className={styles["clear-btn"]}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-x"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div
            className={styles.caret}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-chevron-down"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
          <li
            className={`${styles.option} ${styles.embedding}`}
            onClick={() => {
              setModalIsOpen(true);
            }}
          >
            Agregar
          </li>

          {options.map((option, index) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              key={option.value}
              className={`${styles.option} ${
                isOptionSelected(option) ? styles.selected : ""
              } `}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
      {modalIsOpen ? <Modal setModalIsOpen={() => setModalIsOpen()} /> : null}
    </div>
  );
};

export default Dropdown;
