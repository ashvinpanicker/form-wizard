import React, { FC } from "react";
import Button from "../Button";
import "./SingleCheck.css";

interface Check {
  id: string;
  priority: number;
  description: string;
  updateResults?: (id, value, event) => void;
  disabled?: boolean;
  selectedCheck?: number;
  index?: number;
}

const SingleCheck: FC<Check> = ({
  id,
  description,
  updateResults,
  disabled,
  selectedCheck,
  index
}) => (
  <div
    key={id}
    id={`check${index}`}
    className={`SingleCheck ${disabled ? "disabled" : ""}  ${
      selectedCheck === index && !disabled ? "active" : ""
    }`}
  >
    <p>{description}</p>
    <div className="btn-group">
      <Button
        id={`yes${index}`}
        onClick={(e) => {
          updateResults(id, "Yes", e);
        }}
      >
        Yes
      </Button>
      <Button
        id={`no${index}`}
        onClick={(e) => {
          updateResults(id, "No", e);
        }}
      >
        No
      </Button>
    </div>
  </div>
);

export default SingleCheck;
export { Check };
