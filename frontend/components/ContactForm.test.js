import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);

  const header = screen.getByText(/contact form/i);
  expect(header).toBeInTheDocument();
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const message = "Error: firstName must have at least 5 characters.";
  const nameInput = screen.getByLabelText(/first name*/i);
  userEvent.type(nameInput, "a");

  await waitFor(() => {
    const errorMessage = screen.queryByText(message);
    expect(errorMessage).toBeInTheDocument();
  });
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);

  const submitBtn = screen.getByRole("button");
  userEvent.click(submitBtn);

  await waitFor(() => {
    const errorMessage = screen.queryAllByText(/error:/i);
    expect(errorMessage).toHaveLength(3);
  });
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);

  const fNameInput = screen.getByLabelText(/first name*/i);
  userEvent.type(fNameInput, "Steven");

  const lNameInput = screen.getByLabelText(/last name*/i);
  userEvent.type(lNameInput, "Wilson");

  const submitBtn = screen.getByRole("button");
  userEvent.click(submitBtn);

  await waitFor(() => {
    const errorMessage = screen.queryAllByText(/error:/i);
    expect(errorMessage).toHaveLength(1);
  });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, "steveWilson.com");

  await waitFor(() => {
    const errorMessage = screen.queryByText(
      /Error: email must be a valid email address/i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);

  const fNameInput = screen.getByLabelText(/first name*/i);
  userEvent.type(fNameInput, "Steven");

  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, "steveWilson@gmail.com");

  const submitBtn = screen.getByRole("button");
  userEvent.click(submitBtn);

  await waitFor(() => {
    const errorMessage = screen.queryByText(
      /Error: lastname is a required field./i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);

  const user = {
    fistName: "Steven",
    lastName: "Wilson",
    email: "stevenWilson3@gmail.com",
  };

  const fNameInput = screen.getByLabelText(/first name*/i);
  userEvent.type(fNameInput, user.fistName);
  expect(fNameInput).toHaveValue("Steven");

  const lNameInput = screen.getByLabelText(/last name*/i);
  userEvent.type(lNameInput, user.lastName);
  expect(lNameInput).toHaveValue("Wilson");

  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, user.email);
  expect(emailInput).toHaveValue("stevenWilson3@gmail.com");

  const submitBtn = screen.getByRole("button");
  userEvent.click(submitBtn);

  await waitFor(() => {
    const errorMessage = screen.queryAllByText(/error:/i);
    expect(errorMessage).toHaveLength(0);
  });
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);

  const user = {
    fistName: "Steven",
    lastName: "Wilson",
    email: "stevenWilson3@gmail.com",
  };

  const submitHeader = screen.queryByText(/you submitted:/i);
  expect(submitHeader).not.toBeInTheDocument();

  const fNameInput = screen.getByLabelText(/first name*/i);
  userEvent.type(fNameInput, user.fistName);
  expect(fNameInput).toHaveValue("Steven");

  const lNameInput = screen.getByLabelText(/last name*/i);
  userEvent.type(lNameInput, user.lastName);
  expect(lNameInput).toHaveValue("Wilson");

  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, user.email);
  expect(emailInput).toHaveValue("stevenWilson3@gmail.com");

  const submitBtn = screen.getByRole("button");
  userEvent.click(submitBtn);

  expect(submitHeader).not.toBeInTheDocument();
});
