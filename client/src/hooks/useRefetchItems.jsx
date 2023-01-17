import { useQuery } from "react-query";
import todoApi from "../api/todo";
import { useDispatch } from "react-redux";
import { setItems } from "../stores/Todo/todoSlice";

function useRefetchItems() {
  const dispatch = useDispatch();
  const query = useQuery("GET_ALL_TODO_ITEMS", () => todoApi.getTodos(), {
    onSuccess: data => {
      dispatch(setItems(data));
    },
  });

  return query;
}

export default useRefetchItems;