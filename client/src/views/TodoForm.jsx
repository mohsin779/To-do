import React, { useMemo, useState } from "react";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { todoSchema } from "../validations/TodoValidation";

import { useMutation, useQuery } from "react-query";

import todoApi from "../api/todo";

import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Center, CheckBox, Error } from "../components";
import { useEffect } from "react";
import { actions } from "../stores";

const TodoForm = () => {
  const { setSelectedItem, toggleShowForm } = actions;
  const dispatch = useDispatch();

  const { selectedItem } = useSelector(state => state.todo);
  const [labels, setLabels] = useState(() =>
    selectedItem.labels ? selectedItem.labels.map(lbl => lbl._id) : []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(todoSchema),
  });

  const addTodoMutation = useMutation({
    mutationFn: formData => {
      return todoApi.addTodo(formData);
    },
    onSuccess: data => {
      closeForm();
    },
  });

  const editTodoMutation = useMutation({
    mutationFn: formData => {
      return todoApi.editTodo(formData, selectedItem._id);
    },
    onSuccess: data => {
      closeForm();
    },
  });

  const query = useQuery("GET_ALL_LABELS", () => todoApi.getLabels());

  const [imgSrc, setImgSrc] = useState(() => {
    return selectedItem.image ? selectedItem.image : "";
  });
  const [file, setFile] = useState("");

  const formInputs = [
    {
      placeholder: "Title",
      name: "title",
      type: "text",
      defVal: selectedItem.title,
    },
    {
      placeholder: "Description",
      name: "description",
      type: "textarea",
      defVal: selectedItem.description,
    },
  ];

  const closeForm = () => {
    dispatch(toggleShowForm());
    dispatch(setSelectedItem({}));
  };

  useEffect(() => {
    console.log("ERRORS", errors);
  }, [errors]);

  const onSubmit = async data => {
    const formData = new FormData();

    let labels = data.labels;

    if (typeof labels === "string") labels = [labels];

    formData.append("image", data.image[0]);
    labels.forEach(label => {
      formData.append("labels", label);
    });
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("status", false);

    if (selectedItem._id) editTodoMutation.mutate(formData);
    else addTodoMutation.mutate(formData);
  };

  const onSelect = id => {
    const itemIndex = labels.findIndex(label => label === id);

    const tempLabels = [...labels];
    if (itemIndex > -1) tempLabels.slice(0, itemIndex);
    else tempLabels.push(id);

    setLabels(tempLabels);
  };

  const imageRegister = register("image", { required: true });

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        {addTodoMutation.isLoading || editTodoMutation.isLoading ? (
          <div className="loading-container">
            <Center>
              <ActivityIndicator></ActivityIndicator>
            </Center>
          </div>
        ) : null}
        <div>
          <span onClick={closeForm} className="close">
            &times;
          </span>
        </div>
        {formInputs.length
          ? formInputs.map(inputItem => (
              <div className="inputs-container" key={inputItem.name}>
                {inputItem.type == "textarea" ? (
                  <textarea
                    defaultValue={inputItem.defVal}
                    className={`input-field ${
                      !errors[inputItem.name] ? "" : "error-msg"
                    }`}
                    type={inputItem.type}
                    {...register(inputItem.name)}
                    placeholder={inputItem.placeholder}
                  />
                ) : (
                  <input
                    defaultValue={inputItem.defVal}
                    className={`input-field ${
                      !errors[inputItem.name] ? "" : "error-msg"
                    }`}
                    type={inputItem.type}
                    {...register(inputItem.name)}
                    placeholder={inputItem.placeholder}
                  />
                )}
                {
                  <Error>
                    {errors[inputItem.name]
                      ? inputItem.errorMsg
                        ? inputItem.errorMsg
                        : errors[inputItem.name].message
                      : " "}
                  </Error>
                }
              </div>
            ))
          : null}
        <div className="labels-container">
          <p>Labels</p>
          {query.isSuccess
            ? query.data.map(labelItem => (
                <>
                  <div className="check-container" key={labelItem._id}>
                    <CheckBox
                      value={labelItem._id}
                      text={labelItem.title}
                      onChangeStatus={() => {
                        onSelect(labelItem._id);
                      }}
                      id={labelItem._id}
                      register={() => register("labels")}
                    />
                  </div>
                </>
              ))
            : null}
        </div>
        <div style={{ alignSelf: "flex-start" }}>
          <Error>{errors["labels"] ? errors["labels"].message : " "}</Error>
        </div>

        <div className="file-container">
          <input
            className="file-upload"
            type="file"
            id="image"
            accept="image/*"
            {...register("image")}
            onChange={e => {
              let src = URL.createObjectURL(e.target.files[0]);
              setImgSrc(src);
              setFile(e.target.files[0].name);

              imageRegister.onChange(e);
            }}
            onBlur={imageRegister.onBlur}
            ref={imageRegister.ref}
          />
          <label htmlFor="image">{file ? file : "Choose an Image"}</label>
        </div>
        <div style={{ alignSelf: "flex-start" }}>
          <Error>{errors["image"] ? errors["image"].message : " "}</Error>
        </div>

        <div className="img-preview">
          {imgSrc ? <img src={imgSrc} /> : null}
        </div>
        <input
          className="btn-primary"
          type="submit"
          value={selectedItem._id ? "Edit" : "Add"}
        />
      </form>
    </div>
  );
};

export default TodoForm;
