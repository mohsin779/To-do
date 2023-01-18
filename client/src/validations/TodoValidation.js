import * as yup from "yup";

export const todoSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  // file: yup.mixed().test("file", "You need to provide a file", value => {
  //   if (value.length > 0) {
  //     return true;
  //   }
  //   return false;
  // }),
  // labels: yup.string().required(),
  // labels: yup.array().min(1).required().test()
  // labels: yup.boolean().oneOf([true, false], "H").default(false).required(),
  // image: yup.object().shape({
  //   file: yup

  //     .object()
  //     .shape({
  //       name: yup.string(),
  //     })
  //     .required("File required"),
  // }),
  // labels: yup.array().min(1).required("Please select a label"),
});
export const labelSchema = yup.object().shape({
  title: yup.string().required(),
  color: yup.string().required(),
});
