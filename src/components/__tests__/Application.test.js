import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Applicaiton", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getAllByTestId(appointment, "set-interviewer-test")[0]);

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointmentList = getAllByTestId(container, "appointment");
    const [appointment] = appointmentList.filter((app) => {
      const hasAppointment = queryByText(app, "Archie Cohen");
      if (hasAppointment) {
        return app;
      }
    });

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(
      getByText(appointment, "Delete the appointment?")
    ).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(queryByText(appointment, "Deleting"));

    await waitForElementToBeRemoved(() => queryByText(appointment, "Deleting"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointmentList = getAllByTestId(container, "appointment");
    const [appointment] = appointmentList.filter((app) => {
      const hasAppointment = queryByText(app, "Archie Cohen");
      if (hasAppointment) {
        return app;
      }
    });

    fireEvent.click(getByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByText(appointment, "Save"));
    expect(queryByText(appointment, "Saving"));

    await waitForElementToBeRemoved(() => queryByText(appointment, "Saving"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getAllByTestId(appointment, "set-interviewer-test")[0]);

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));

    expect(
      getByText(appointment, /could not save appointment/i)
    ).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointmentList = getAllByTestId(container, "appointment");
    const [appointment] = appointmentList.filter((app) => {
      const hasAppointment = queryByText(app, "Archie Cohen");
      if (hasAppointment) {
        return app;
      }
    });

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(
      getByText(appointment, "Delete the appointment?")
    ).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));
    expect(queryByText(appointment, "Deleting"));

    await waitForElementToBeRemoved(() => queryByText(appointment, "Deleting"));

    expect(
      getByText(appointment, /could not delete appointment/i)
    ).toBeInTheDocument();
  });
});
