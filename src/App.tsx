import React, { useEffect, useState } from "react";
import "./styles.css";
import { fetchChecks, submitCheckResults } from "./api";
import SingleCheck from "./components/SingleCheck";
import Button from "./components/Button";

export default function App() {
  const [listOfChecks, setListOfChecks] = useState(null);
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const [results, setResults] = useState([]);
  const [selectedCheck, setSelectedCheck] = useState(0);

  interface resultObj {
    checkId: string;
    result: string;
  }

  // Check if item of same id exists in array of objects
  const doesItemExist = (dataset: Array<resultObj>, id: string): boolean =>
    dataset.some((item) => item.checkId === id);

  // Update formdata
  const updateResults = (
    id: string,
    value: string,
    e: (Event & { target: HTMLInputElement }) | HTMLElement
  ): void => {
    let newResults;
    let currentItemObj = {
      checkId: id,
      result: value
    };
    // let anyNos = newResults.find((res) => res.result === "No")

    // If it exists change its value
    if (doesItemExist(results, id)) {
      newResults = results.map((d) => {
        if (d.checkId === id) return currentItemObj;
        else return d;
      });
    } else {
      // If it doesn't exist append its value to results
      newResults = [...results, currentItemObj];
    }
    newResults = newResults.filter((x) => x); // remove null values
    if (newResults.length > 0) {
      // if all answers not submitted
      if (newResults.length === listOfChecks.length || value === "No") {
        document.getElementById("submit-btn").classList.add("active");
        setSubmitDisabled(false);
      } else {
        document.getElementById("submit-btn").classList.remove("active");
        setSubmitDisabled(true);
      }
    }
    let temp = [];
    for (let i = 0; i < newResults.length; i++) {
      temp.push(newResults[i]);
      if (newResults[i].result === "No") break;
    }
    setResults(temp);
    // handle keystrokes update active class
    if (e instanceof Element) {
      for (let element of e.children[1].children) {
        element.classList.remove("active");
        if (value === "No" && element.innerHTML === "No")
          element.classList.add("active");
        if (value === "Yes" && element.innerHTML === "Yes")
          element.classList.add("active");
      }
    } else {
      // handle click update active class
      for (let element of e.target.parentElement.children) {
        element.classList.remove("active");
      }
      e.target.classList.add("active");
    }
  };

  const keystrokeListener = (event) => {
    if (event.keyCode === 38) {
      setSelectedCheck(selectedCheck - 1);
    } else if (event.keyCode === 40) {
      setSelectedCheck(selectedCheck + 1);
    } else if (event.keyCode === 49 && listOfChecks.length > 0) {
      updateResults(
        listOfChecks[selectedCheck]?.id,
        "Yes",
        document.getElementById(`check${selectedCheck}`)
      );
    } else if (event.keyCode === 50 && listOfChecks.length > 0) {
      updateResults(
        listOfChecks[selectedCheck]?.id,
        "No",
        document.getElementById(`check${selectedCheck}`)
      );
    } else
      console.log(
        "Other key was pressed",
        event.keyCode,
        listOfChecks,
        selectedCheck
      );
  };

  // Compare results with formdata and toggle disabled state of SingleCheck Component
  const isCheckItemDisabled = (index: number): boolean => {
    if (results.length > 0) {
      if (results.length >= index)
        if (!results[index - 1] || results[index - 1].result === "Yes")
          // enable item if formdata is filled for it or previous checkItem
          return false;
    } else {
      // First item is enabled if formdata is empty
      if (index === 0) return false;
    }
    return true;
  };

  useEffect(() => {
    // Get data
    fetchChecks().then((list) => {
      // Order items by priority
      let ol = list.sort((a, b) => a.priority - b.priority);
      setListOfChecks(ol);
    });
  }, []);

  useEffect(() => {
    // Setup Keystroke listener
    window.addEventListener("keydown", keystrokeListener);

    return function cleanup() {
      window.removeEventListener("keydown", keystrokeListener);
    };
  }, [listOfChecks, selectedCheck]);

  return (
    <div className="App">
      {listOfChecks?.map((d, i) => (
        <SingleCheck
          key={`check#${i}`}
          index={i}
          disabled={isCheckItemDisabled(i)}
          updateResults={updateResults}
          selectedCheck={selectedCheck}
          {...d}
        />
      ))}
      <Button
        id="submit-btn"
        disabled={isSubmitDisabled}
        style={{
          marginTop: 50,
          marginRight: 50,
          float: "right",
          border: "none",
          height: 40
        }}
        onClick={() => {
          console.log(results);
          submitCheckResults(results);
        }}
      >
        SUBMIT
      </Button>
    </div>
  );
}
