"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./toDo.module.css";
import classNames from "classnames";
import Button from "../Buttons/Button Set 1/button";
import { FocusTrap } from "focus-trap-react";
import TrashIcon from "./SvgTrash";
import CheckmarkIcon from "./SvgCheckmark";
import { uniqueId } from "lodash";
import Modal from "@/app/ui/Modals/Modal-1/modal";

type Task = {
  id: string;
  name: string;
  description: string;
  status: "complete" | "incomplete" | "onHold";
  lastUpdated: Date;
  index: number;
};

type TaskGroup = {
  label: string;
  status: string;
  tasks: Task[];
};

interface TaskProps {
  name: string;
  description: string;
  status: string;
  lastUpdated: Date;
  ref?: any;
  updateTask?: () => void;
  deleteTask?: () => void;
  completeTask?: () => void;
  moveTask?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function Task({
  name,
  description,
  status,
  lastUpdated,
  ref,
  updateTask,
  deleteTask,
  completeTask,
  onDragStart,
  moveTask,
}: TaskProps) {
  const [showFull, setShowFull] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showUpdateTask, setShowUpdateTask] = useState(false);

  function finishCompleting() {
    completeTask?.();
  }

  function finishDeleting() {
    deleteTask?.();
  }

  function getDateString() {
    const localeDateString = lastUpdated.toLocaleDateString();
    const slashSplit = localeDateString.split(`/`);
    const dateString = `${slashSplit[0]}/${slashSplit[1]}/${slashSplit[2].slice(
      2
    )}`;
    const localeTimeString = lastUpdated.toLocaleTimeString();
    const colonSplit = localeTimeString.split(`:`);
    const spaceSplit = localeTimeString.split(` `);
    const timeString = `${colonSplit[0]}:${colonSplit[1]} ${
      spaceSplit[spaceSplit.length - 1]
    }`;
    return `${dateString}, ${timeString}`;
  }

  return (
    <div
      className={classNames(styles.task, styles[status])}
      ref={ref}
      draggable={true}
      onDragStart={onDragStart}
    >
      <Button
        variant="secondary"
        width="full"
        onClick={() => setShowFull(!showFull)}
        title={showFull ? "Close Task" : "Open Task"}
        ariaLabel={showFull ? "Close Task" : "Open Task"}
        style={{
          color: "var(--bw)",
          borderColor: "rgb(96, 96, 96)",
          fontWeight: "500",
          textWrap: "balance",
        }}
      >
        {name}
      </Button>
      {showFull && (
        <div className={styles.task_full}>
          <div className={styles.description_wrapper}>
            {description && (
              <div className={styles.description}>{description}</div>
            )}

            <footer className={styles.task_footer}>
              <div className={styles.last_updated}>{getDateString()}</div>
              <div className={styles.task_controls}>
                <Button
                  variant="tertiary"
                  ariaLabel="Delete this task"
                  width={"smallest"}
                  title="Delete task"
                  onClick={() => setShowConfirmDelete(true)}
                  style={{ width: "4.0rem", padding: "0" }}
                >
                  <TrashIcon className={styles.icon} />
                </Button>
                {status != "complete" && (
                  <Button
                    variant="tertiary"
                    width="smallest"
                    ariaLabel="Mark as complete"
                    title="Mark as complete"
                    onClick={finishCompleting}
                    style={{ width: "4.0rem", padding: "0" }}
                  >
                    <CheckmarkIcon className={styles.icon} />
                  </Button>
                )}
              </div>
            </footer>
          </div>
        </div>
      )}

      {showConfirmDelete && (
        <Modal closeFunction={() => setShowConfirmDelete(false)}>
          <div className={styles.confirm_delete_wrapper}>
            <div className={styles.confirm_delete_message}>
              {`Delete`}
              <div>
                <span>{`"`}</span>
                <span className={styles.bold}>{name}</span>
                <span>{`"?`}</span>
              </div>
            </div>
            <div className={styles.confirm_delete_controls}>
              <Button
                variant="tertiary"
                width="smallest"
                ariaLabel="Cancel deleting task"
                onClick={() => setShowConfirmDelete(false)}
              >
                {`Cancel`}
              </Button>
              <Button
                variant="primary"
                width="smallest"
                ariaLabel="Confirm task deletion"
                onClick={finishDeleting}
                style={{ backgroundColor: "rgb(96, 96, 96)" }}
              >
                {`Delete`}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

interface ToDoProps {
  user?: {};
  data?: {};
}

export default function ToDo({ user, data }: ToDoProps) {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showMenuButtons, setShowMenuButtons] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortedTasks, setSortedTasks] = useState<TaskGroup[]>();
  const justSorted = useRef(false);

  const checkboxRefs = useRef<(HTMLInputElement | null)[]>([]);
  const lastCheckboxChecked = useRef(0);

  //New Task Form
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const initialFormData = {
    name: "",
    description: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const initialErrors = {
    name: "",
    description: "",
  };
  const [formErrors, setFormErrors] = useState(initialErrors);
  //Handles form input changes
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  //Focuses the input when you open the form
  useEffect(() => {
    inputRef.current?.focus();
    return () => {};
  }, [showForm]);

  //Adds a new task if the form is valid
  function submitNewTask(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors(initialErrors);
    let errors = initialErrors;
    let errorFound = false;
    if (formData.name.length < 1) {
      errors.name = "Give a name for your task";
      errorFound = true;
    } else if (formData.name.length > 96) {
      errors.name = "Task name is too long";
      errorFound = true;
    }
    if (formData.description.length > 1024) {
      errors.description = "Description is too long";
      errorFound = true;
    }
    if (errorFound) {
      setFormErrors(errors);
      return;
    }
    const task: Task = {
      id: uniqueId(`task-`),
      name: formData.name,
      description: formData.description,
      status: "incomplete",
      lastUpdated: new Date(),
      index: 0,
    };
    setTasks((prev) => [task, ...prev.slice()]);
    closeNewTaskForm();
  }

  //Opens the delete tasks menu
  function openDeleteMenu() {
    lastCheckboxChecked.current = 0;
    setShowMenuButtons(false);
    setShowDeleteMenu(true);
  }

  //Closes the delete tasks menu
  function closeDeleteMenu() {
    setShowDeleteMenu(false);
    setShowDeleteButton(false);
    setShowMenuButtons(true);
  }

  //Allows shift click selecting of checkboxes
  function handleCheckboxClick(e: React.MouseEvent, index: number) {
    checkboxRefs.current.some((checkbox) => {
      return checkbox?.checked === true;
    })
      ? setShowDeleteButton(true)
      : setShowDeleteButton(false);
    if (e.shiftKey && checkboxRefs.current[index]?.checked) {
      for (
        let i = Math.min(index, lastCheckboxChecked.current);
        i < Math.max(index, lastCheckboxChecked.current);
        i++
      ) {
        const checkbox = checkboxRefs.current[i];
        if (checkbox) {
          checkbox.checked = true;
        }
      }
    }
    if (checkboxRefs.current[index]?.checked) {
      lastCheckboxChecked.current = index;
    }
  }

  //Does identical things as handleCheckboxClick
  function handleCheckboxKeydown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (e.key === "Enter") {
      const checkbox = checkboxRefs.current[index];
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      if (e.shiftKey && checkboxRefs.current[index]?.checked) {
        for (
          let i = Math.min(index, lastCheckboxChecked.current);
          i < Math.max(index, lastCheckboxChecked.current);
          i++
        ) {
          const checkbox = checkboxRefs.current[i];
          if (checkbox) {
            checkbox.checked = true;
          }
        }
      }
      if (checkboxRefs.current[index]?.checked) {
        lastCheckboxChecked.current = index;
      }
      checkboxRefs.current.some((checkbox) => {
        return checkbox?.checked === true;
      })
        ? setShowDeleteButton(true)
        : setShowDeleteButton(false);
    }
  }

  //Deletes all tasks selected
  function deleteTasks() {
    const toBeDeleted = checkboxRefs.current
      .map((checkbox, index) => (checkbox?.checked === true ? index : -1))
      .filter((index) => index !== -1);
    const newTasks: Task[] = [];
    tasks.map((task, index) => {
      toBeDeleted[0] === index ? toBeDeleted.shift() : newTasks.push(task);
    });
    setTasks(newTasks);
    closeDeleteMenu();
  }

  //Closes the add new task modal
  function closeNewTaskForm() {
    setShowForm(false);
    setFormData(initialFormData);
    setFormErrors(initialErrors);
  }

  //Submits the form when user hits enter in the textarea
  function handleDescriptionKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  //Sorts the tasks when a change is made
  function sortTasks() {
    const tasksGroups: Record<string, TaskGroup> = {
      incomplete: {
        status: "incomplete",
        label: "Current Tasks",
        tasks: [],
      },
      complete: {
        status: "complete",
        label: "Completed Tasks",
        tasks: [],
      },
      onHold: {
        status: "onHold",
        label: "On Hold",
        tasks: [],
      },
    };
    tasks.forEach((task) => {
      tasksGroups[task.status].tasks.push(task);
    });
    const taskGroupsArr = Object.values(tasksGroups);
    const newTasks: Task[] = [];
    let index = 0;
    taskGroupsArr.forEach((taskGroup) => {
      taskGroup.tasks.forEach((task) => {
        task.index = index;
        index++;
        newTasks.push(task);
      });
    });
    justSorted.current = true;
    setTasks(newTasks);
    setSortedTasks(taskGroupsArr);
  }

  //Sorts the tasks when a change is made
  useEffect(() => {
    justSorted.current ? (justSorted.current = false) : sortTasks();
  }, [tasks]);

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, task: Task) {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ id: task.id, status: task.status })
    );
  }

  function handleDrop(e: React.DragEvent, dropStatus: string) {
    e.preventDefault();
    const draggedData = JSON.parse(e.dataTransfer.getData("text/plain"));
    const draggedId = draggedData.id;

    const draggedTaskIndex = tasks.findIndex((task) => task.id === draggedId);
    const draggedTask = tasks[draggedTaskIndex];

    // Stops drops across different status categories
    if (draggedTask.status !== dropStatus) return;

    const groupTasks =
      sortedTasks?.find((g) => g.status === dropStatus)?.tasks || [];
    const container = e.currentTarget;
    const taskElements = Array.from(container.querySelectorAll("li"));
    const mouseY = e.clientY;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    taskElements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const distance = Math.abs(mouseY - centerY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    const groupIndexes = groupTasks.map((task) => task.index);
    const draggedGlobalIndex = draggedTask.index;
    const targetGlobalIndex = groupIndexes[closestIndex];

    if (draggedGlobalIndex === targetGlobalIndex) return;

    const reordered = [...tasks];
    const [movedItem] = reordered.splice(draggedGlobalIndex, 1);
    reordered.splice(targetGlobalIndex, 0, movedItem);
    setTasks(reordered);
  }

  return (
    <div className={styles.to_do}>
      <div className={styles.controls}>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          style={{ backgroundColor: "rgb(96, 96, 96)" }}
        >{`Add New Task`}</Button>
        {tasks.length > 0 && (
          <div className={styles.manage_tasks_wrapper}>
            {showDeleteMenu && (
              <div className={styles.buttons_wrapper}>
                {showDeleteButton && (
                  <Button
                    variant="secondary"
                    width="smallest"
                    ariaLabel="Delete tasks"
                    onClick={deleteTasks}
                    style={{
                      borderColor: "rgb(96, 96, 96)",
                      color: "var(--bw)",
                      fontWeight: "500",
                    }}
                  >
                    {`Delete`}
                  </Button>
                )}
                <Button
                  variant="tertiary"
                  ariaLabel="Cancel deleting tasks"
                  onClick={closeDeleteMenu}
                  width="smallest"
                >
                  {`Cancel`}
                </Button>
              </div>
            )}
            {showMenuButtons && (
              <div className={styles.buttons_wrapper}>
                <Button
                  variant="tertiary"
                  ariaLabel="Delete tasks menu"
                  title="Delete tasks"
                  onClick={openDeleteMenu}
                  width="smallest"
                >
                  <TrashIcon height={"100%"} className={styles.icon} />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.task_groups}>
        {sortedTasks
          ?.filter(({ tasks }) => tasks.length > 0)
          .map(({ label, status, tasks }) => (
            <div
              className={classNames(styles.task_list_wrapper, styles[status])}
              key={label}
            >
              <label className={styles.task_label}>{label}</label>
              <ul
                className={styles.task_list}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, status)}
              >
                {tasks.map((task) => (
                  <li className={styles.task_wrapper} key={task.id}>
                    {showDeleteMenu && (
                      <div className={styles.selection_wrapper}>
                        <input
                          type={"checkbox"}
                          className={styles.checkbox}
                          ref={(el) => {
                            checkboxRefs.current[task.index] = el;
                          }}
                          onClick={(e) => handleCheckboxClick(e, task.index)}
                          onKeyDown={(e) =>
                            handleCheckboxKeydown(e, task.index)
                          }
                        />
                        <span className={styles.checkmark}></span>
                      </div>
                    )}
                    <Task
                      name={task.name}
                      description={task.description}
                      status={task.status}
                      lastUpdated={task.lastUpdated}
                      onDragStart={(e) => handleDragStart(e, task)}
                      deleteTask={() =>
                        setTasks((prev) => [
                          ...prev.slice(0, task.index),
                          ...prev.slice(task.index + 1),
                        ])
                      }
                      completeTask={() => {
                        console.log("completion started");
                        const completedTask = { ...tasks[task.index] };
                        completedTask.status = "complete";
                        completedTask.lastUpdated = new Date();
                        console.log(completedTask);
                        setTasks((prev) => [
                          completedTask,
                          ...prev.slice(0, task.index),
                          ...prev.slice(task.index + 1),
                        ]);
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      {showForm && (
        <Modal closeFunction={closeNewTaskForm}>
          <div className={styles.new_task_wrapper}>
            <form
              className={styles.new_task_form}
              onSubmit={submitNewTask}
              ref={formRef}
            >
              <div className={styles.input_container}>
                <label htmlFor="name">{`Task Name`}</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  ref={inputRef}
                  aria-describedby="nameError"
                  maxLength={96}
                  className={styles.name_input}
                />
                {formErrors.name && (
                  <div
                    className={styles.error}
                    id="nameError"
                    aria-live="polite"
                  >
                    {formErrors.name}
                  </div>
                )}
              </div>
              <div className={styles.input_container}>
                <label htmlFor="description">{`Description`}</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  aria-describedby="descriptionError"
                  maxLength={1024}
                  className={styles.description_input}
                  onKeyDown={handleDescriptionKeyDown}
                />
                {formErrors.name && (
                  <div
                    className={styles.error}
                    id="descriptionError"
                    aria-live="polite"
                  >
                    {formErrors.description}
                  </div>
                )}
              </div>
              <Button
                variant={"primary"}
                type={"submit"}
                style={{ backgroundColor: "rgb(96, 96, 96)" }}
              >{`Add Task`}</Button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
