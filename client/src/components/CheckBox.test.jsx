import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, test } from "vitest";

import CheckBox from "./CheckBox";

describe("CheckBox Component", () => {
  test("should render the same text passed as props", () => {
    const text = "Mark as Done";
    render(<CheckBox register={() => {}} text={text} />);

    const paragraphElement = screen.getByText(text);

    expect(paragraphElement).toBeInTheDocument();
  });

  test("should be unchecked initially if checked is not passed", () => {
    render(<CheckBox register={() => {}} text="Mark as Done" />);

    const checkBoxElement = screen.getByRole("checkbox");

    expect(checkBoxElement).not.toBeChecked();
  });
});
