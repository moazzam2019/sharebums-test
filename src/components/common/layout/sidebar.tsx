import React from "react";
import { connect } from "react-redux";
import {
  HomeIcon,
  ModelIcon,
  TickIcon,
  ModelActiveIcon,
  HomeActiveIcon,
} from "src/icons";
import Link from "next/link";
import "./sidebar.less";

import Router, { withRouter, Router as RouterEvent } from "next/router";

interface SidebarProps {
  router: any;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { router } = props;
  return (
    <div>
      {" "}
      <div className="icons">
        <Link href="/home">
          <a>
            <div
              className={`full-icon ${
                router.pathname === "/home" ? "active-icon-name" : ""
              }`}
            >
              <div className="icon">
                {router.pathname === "/home" ? (
                  <HomeActiveIcon />
                ) : (
                  <HomeIcon />
                )}
              </div>
              <div className="icon-name">Home</div>
            </div>
          </a>
        </Link>
        <Link href="/model">
          <a>
            <div
              className={`full-icon ${
                router.pathname === "/model" ? "active-icon-name" : ""
              }`}
            >
              <div className="icon">
                {router.pathname === "/model" ? (
                  <ModelActiveIcon />
                ) : (
                  <ModelIcon />
                )}
              </div>
              <div className="icon-name">Models</div>
            </div>
          </a>
        </Link>
      </div>
      {/* Active Users */}
      <div className="fans-main">
        <div>Chat with active Fans</div>
        <div className="active-fans-main">
          <img
            src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?w=2000"
            alt=""
          />
          <div>
            <span className="active-fan-name">Name</span>
            <br />
            <span className="active-fan-username">@name</span>
          </div>
          <div className="tick-icon">
            <TickIcon />
          </div>
        </div>
      </div>
      {/* Your Followers */}
      <div className="followers-main">
        <div>Your Followers</div>
        <div className="active-fans-main">
          <img
            src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?w=2000"
            alt=""
          />
          <div>
            <span className="active-fan-name">Name</span>
            <br />
            <span className="active-fan-username">@name</span>
          </div>
          <div className="tick-icon">
            <TickIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStates = (state: any) => ({
  ui: { ...state.ui },
  user: { ...state.user.current },
  feedState: { ...state.feed.feeds },
  settings: { ...state.settings },
});
export default withRouter(connect(mapStates)(Sidebar)) as any;
