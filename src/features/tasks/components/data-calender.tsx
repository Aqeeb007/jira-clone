import { Task } from "../types";

type DataCalenderProps = {
  data: Task[];
};

export const DataCalender = ({ data }: DataCalenderProps) => {
  return <div>{data.length}</div>;
};
