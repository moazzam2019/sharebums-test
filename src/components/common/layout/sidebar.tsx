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
import { performerService } from "@services/performer.service";
import Router, { withRouter, Router as RouterEvent } from "next/router";
import { useState, useEffect } from "react";

interface SidebarProps {
  router: any;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { router, user } = props;
  const [loadingPerformer, setLoadingPerformer] = useState<boolean>(false);
  const [randomPerformers, setRandomPerformers] = useState<User[]>([]);
  const [isFreeSubscription, setIsFreeSubscription] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showAllFollowed, setShowAllFollowed] = useState<boolean>(false);

  const handleClickShowAll = () => {
    setShowAll(true);
  };
  const handleClickShowLess = () => {
    setShowAll(false);
  };

  const handleClickShowAllFollowed = () => {
    setShowAllFollowed(true);
  };
  const handleClickShowLessFollowed = () => {
    setShowAllFollowed(false);
  };

  useEffect(() => {
    const getPerformers = async () => {
      try {
        setLoadingPerformer(true);
        const performers = await (
          await performerService.randomSearch()
        ).data.data;
        setRandomPerformers(performers.filter((p) => p._id !== user._id));
        setLoadingPerformer(false);
      } catch {
        setLoadingPerformer(false);
      }
    };

    getPerformers();
  }, [isFreeSubscription, user]);

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
                router.pathname === "/model" ||
                router.pathname === "/model/profile"
                  ? "active-icon-name"
                  : ""
              }`}
            >
              <div className="icon">
                {router.pathname === "/model" ||
                router.pathname === "/model/profile" ? (
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
      {!user._id && (
        <div className="sign-up-sidebar">
          <div className="sign-up-sidebar-text">
            Sign up to follow models, see their content and chat.
          </div>
          <Link href="/auth/fan-register">
            <div className="sign-up-sidebar-button">Sign up</div>
          </Link>
        </div>
      )}
      {/* Fan View Starts Here */}
      {/* Suggested Accounts */}
      {(!user.isPerformer || !user._id) && (
        <div className="fans-main">
          <div>Suggested Accounts</div>
          {randomPerformers.length > 0 &&
            randomPerformers
              .filter((performer) => performer.isFollowed === false)
              .slice(0, showAll ? randomPerformers.length : 6) // Show only 6 performers by default, or all if "showAll" is true
              .map((performer) => (
                <Link href={`/${performer.username}`} key={performer._id}>
                  <div
                    className="active-fans-main"
                    style={{ cursor: "pointer" }}
                  >
                    <img src={performer.avatar} alt={performer.name} />
                    <div>
                      <span className="active-fan-name">{performer.name}</span>
                      <br />
                      <span className="active-fan-username">
                        @{performer.username}
                      </span>
                    </div>
                    {performer.verifiedAccount && (
                      <div className="tick-icon">
                        <TickIcon />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
          {randomPerformers.length > 6 && !showAll && (
            <div onClick={handleClickShowAll} className="show-all-and-less">
              Show all
            </div>
          )}
          {randomPerformers.length > 6 && showAll && (
            <div onClick={handleClickShowLess} className="show-all-and-less">
              Show less
            </div>
          )}
        </div>
      )}
      {/* Accounts you follow */}
      {!user.isPerformer && randomPerformers?.length > 0 && user._id && (
        <div className="followers-main">
          <div>Accounts you follow</div>
          {randomPerformers
            .filter((performer) => performer.isFollowed === true)
            .slice(0, showAllFollowed ? randomPerformers.length : 6) // Use slice to limit number of accounts displayed
            .map((performer) => (
              <Link href={`/${performer.username}`} key={performer._id}>
                <div className="active-fans-main" style={{ cursor: "pointer" }}>
                  <img src={performer.avatar} alt={performer.name} />
                  <div>
                    <span className="active-fan-name">{performer.name}</span>
                    <br />
                    <span className="active-fan-username">
                      @{performer.username}
                    </span>
                  </div>
                  {performer.verifiedAccount && (
                    <div className="tick-icon">
                      <TickIcon />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          {randomPerformers.filter((performer) => performer.isFollowed === true)
            .length > 6 &&
            !showAllFollowed && (
              <div
                onClick={handleClickShowAllFollowed}
                className="show-all-and-less"
              >
                Show all
              </div>
            )}
          {randomPerformers.length > 6 && showAllFollowed && (
            <div
              onClick={handleClickShowLessFollowed}
              className="show-all-and-less"
            >
              Show less
            </div>
          )}
        </div>
      )}
      {/* Model View Starts Here */}
      {/* Active Users */}
      {user.isPerformer && (
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
      )}
      {/* Your Followers */}
      {user.isPerformer && (
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
      )}
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
