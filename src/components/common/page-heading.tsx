import Router from "next/router";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface Iprops {
  title: string;
  icon?: any;
}

const PageHeading = ({ title, icon }: Iprops) => (
  <div className="page-heading">
    <span aria-hidden onClick={() => Router.back()}>
      {icon || <ArrowLeftOutlined />}{" "}
      <span style={{ paddingLeft: "10px" }}>{title}</span>
    </span>
  </div>
);

PageHeading.defaultProps = {
  icon: null,
};

export default PageHeading;
