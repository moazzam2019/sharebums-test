/* eslint-disable no-prototype-builtins */
import { Component } from 'react';
import {
  message, Modal, Button, Avatar, Tabs
} from 'antd';
import {
  UnlockOutlined, LockOutlined
} from '@ant-design/icons';
import {
  FavoriteSvg, ImageFillIcon, SendTipSvg, TickIcon, VideoFillIcon
} from 'src/icons';
import Link from 'next/link';
import { CommentForm, ListComments } from '@components/comment';
import {
  getComments, moreComment, createComment, deleteComment
} from '@redux/comment/actions';
import { videoDuration, shortenLargeNumber } from '@lib/index';
import {
  reactionService, feedService, tokenTransctionService, paymentService, reportService
} from '@services/index';
import { connect } from 'react-redux';
import { TipPerformerForm } from '@components/performer/tip-form';
import { VideoPlayer } from '@components/common/video-player';
import { ConfirmSubscriptionPerformerForm } from '@components/performer';
import { ReportForm } from '@components/report/report-form';
import Router from 'next/router';
import { updateBalance } from '@redux/user/actions';
import Loader from '@components/common/base/loader';
import { IFeed, ISettings, IUser } from 'src/interfaces';
import { TabPane } from '@components/common/base/tabs';
import { PurchaseFeedForm } from './confirm-purchase';
import FeedSlider from './post-slider';
import './post-card.less';
import { FeedGridCard } from './grid-card';

interface IProps {
  feed: IFeed;
  onDelete?: Function;
  user: IUser;
  updateBalance: Function;
  getComments: Function;
  moreComment: Function;
  createComment: Function;
  deleteComment: Function;
  commentMapping: any;
  comment: any;
  siteName: string;
  settings: ISettings;
}

class FeedCardCustom extends Component<IProps> {
  state = {
    isOpenComment: false,
    isLiked: false,
    isBookMarked: false,
    isBought: false,
    totalLike: 0,
    totalComment: 0,
    isFirstLoadComment: true,
    itemPerPage: 10,
    commentPage: 0,
    isHovered: false,
    openTipModal: false,
    openPurchaseModal: false,
    openTeaser: false,
    submiting: false,
    requesting: false,
    openSubscriptionModal: false,
    openReportModal: false,
    subscriptionType: '',
    relatedListFeeds: []

  };

  componentDidMount() {
    const { feed } = this.props;
    if (feed) {
      this.setState({
        isLiked: feed.isLiked,
        isBookMarked: feed.isBookMarked,
        isBought: feed.isBought,
        totalLike: feed.totalLike,
        totalComment: feed.totalComment
      });
    }
    this.onChangeTab();
    this.relatedFeeds();
  }

  componentDidUpdate(prevProps) {
    const { feed, commentMapping, comment } = this.props;
    const { totalComment } = this.state;
    if ((!prevProps.comment.data && comment.data && comment.data.objectId === feed._id)
      || (prevProps.commentMapping[feed._id] && totalComment !== commentMapping[feed._id].total)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ totalComment: commentMapping[feed._id].total });
    }
  }

  onChangeTab() {
    const { isFirstLoadComment, itemPerPage } = this.state;
    const { getComments: handleGetComments, feed } = this.props;
    if (isFirstLoadComment) {
      this.setState(
        {
          isFirstLoadComment: false,
          commentPage: 0
        },
        () => {
          handleGetComments({
            objectId: feed._id,
            objectType: 'feed',
            limit: itemPerPage,
            offset: 0
          });
        }
      );
    }
  }

  relatedFeeds = async () => {
    const { feed } = this.props;
    try {
      const resp = await feedService.userSearch({ excludedId: feed._id, performerId: feed.fromSourceId });
      this.setState({ relatedListFeeds: resp.data.data });
    } catch (e) {
      const error = await e;
      message.error(error.message || 'Error occured, please try again later');
    }
  };

  handleJoinStream = () => {
    const { user, feed } = this.props;
    if (!user._id) {
      message.error('Please log in or register!');
      return;
    }
    if (user.isPerformer) return;
    if (!feed?.isSubscribed) {
      message.error('Please subscribe to this model!');
      return;
    }
    Router.push({
      pathname: '/streaming/details',
      query: {
        performer: JSON.stringify(feed?.performer),
        username: feed?.performer?.username || feed?.performer?._id
      }
    }, `/streaming/${feed?.performer?.username || feed?.performer?._id}`);
  };

  handleLike = async () => {
    const { feed } = this.props;
    const { isLiked, totalLike, requesting } = this.state;
    if (requesting) return;
    try {
      await this.setState({ requesting: true });
      if (!isLiked) {
        await reactionService.create({
          objectId: feed._id,
          action: 'like',
          objectType: 'feed'
        });
        this.setState({ isLiked: true, totalLike: totalLike + 1, requesting: false });
      } else {
        await reactionService.delete({
          objectId: feed._id,
          action: 'like',
          objectType: 'feed'
        });
        this.setState({ isLiked: false, totalLike: totalLike - 1, requesting: false });
      }
    } catch (e) {
      const error = await e;
      message.error(error.message || 'Error occured, please try again later');
      this.setState({ requesting: false });
    }
  };

  handleBookmark = async () => {
    const { feed, user } = this.props;
    const { isBookMarked, requesting } = this.state;
    if (requesting || !user._id || user.isPerformer) return;
    try {
      await this.setState({ requesting: true });
      if (!isBookMarked) {
        await reactionService.create({
          objectId: feed._id,
          action: 'book_mark',
          objectType: 'feed'
        });
        this.setState({ isBookMarked: true, requesting: false });
      } else {
        await reactionService.delete({
          objectId: feed._id,
          action: 'book_mark',
          objectType: 'feed'
        });
        this.setState({ isBookMarked: false, requesting: false });
      }
    } catch (e) {
      const error = await e;
      message.error(error.message || 'Error occured, please try again later');
      this.setState({ requesting: false });
    }
  };

  handleReport = async (payload: any) => {
    const { feed } = this.props;
    try {
      await this.setState({ requesting: true });
      await reportService.create({
        ...payload, target: 'feed', targetId: feed._id, performerId: feed.fromSourceId
      });
      message.success('Your report has been sent');
    } catch (e) {
      const err = await e;
      message.error(err.message || 'error occured, please try again later');
    } finally {
      this.setState({ requesting: false, openReportModal: false });
    }
  };

  onOpenComment = () => {
    const { feed, getComments: handleGetComment } = this.props;
    const {
      isOpenComment, isFirstLoadComment, itemPerPage, commentPage
    } = this.state;
    this.setState({ isOpenComment: !isOpenComment });
    if (isFirstLoadComment) {
      this.setState({ isFirstLoadComment: false });
      handleGetComment({
        objectId: feed._id,
        limit: itemPerPage,
        offset: commentPage
      });
    }
  };

  copyLink = () => {
    const { feed } = this.props;
    const str = `${window.location.origin}/post/${feed?.slug || feed?._id}`;
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    message.success('Copied to clipboard');
  };

  moreComment = async () => {
    const { feed, moreComment: handleLoadMore } = this.props;
    const { commentPage, itemPerPage } = this.state;
    this.setState({
      commentPage: commentPage + 1
    });
    handleLoadMore({
      limit: itemPerPage,
      offset: (commentPage + 1) * itemPerPage,
      objectId: feed._id
    });
  };

  deleteComment = (item) => {
    const { deleteComment: handleDelete } = this.props;
    if (!window.confirm('Are you sure to remove this comment?')) return;
    handleDelete(item._id);
  };

  subscribe = async () => {
    const { feed, user, settings } = this.props;
    const { subscriptionType } = this.state;
    if (!user._id) {
      message.error('Please log in!');
      Router.push('/');
      return;
    }
    if (user.isPerformer) return;
    if (settings.paymentGateway === 'stripe' && !user.stripeCardIds.length) {
      message.error('Please add payment card');
      Router.push('/user/cards');
      return;
    }
    try {
      this.setState({ submiting: true });
      const resp = await paymentService.subscribePerformer({
        type: subscriptionType || 'monthly',
        performerId: feed.fromSourceId,
        paymentGateway: settings.paymentGateway
      });
      if (settings.paymentGateway === 'ccbill') {
        window.location.href = resp?.data?.paymentUrl;
      } else {
        this.setState({ openSubscriptionModal: false });
      }
    } catch (e) {
      const err = await e;
      message.error(err.message || 'error occured, please try again later');
      this.setState({ openSubscriptionModal: false, submiting: false });
    }
  };

  sendTip = async (price) => {
    const { feed, user, updateBalance: handleUpdateBalance } = this.props;
    if (user._id === feed?.performer?._id) {
      message.error('Models cannot tip for themselves');
      return;
    }
    if (user.balance < price) {
      message.error('Your wallet balance is not enough');
      Router.push('/wallet');
      return;
    }
    try {
      await this.setState({ requesting: true });
      await tokenTransctionService.sendTip(feed?.performer?._id, { performerId: feed?.performer?._id, price });
      message.success('Thank you for the tip');
      handleUpdateBalance({ token: -price });
    } catch (e) {
      const err = await e;
      message.error(err.message || 'error occured, please try again later');
    } finally {
      this.setState({ requesting: false, openTipModal: false });
    }
  };

  purchaseFeed = async () => {
    const { feed, user, updateBalance: handleUpdateBalance } = this.props;
    if (user.balance < feed.price) {
      message.error('Your wallet balance is not enough');
      Router.push('/wallet');
      return;
    }
    try {
      await this.setState({ requesting: true });
      await tokenTransctionService.purchaseFeed(feed._id, {});
      message.success('Unlocked successfully!');
      this.setState({ isBought: true });
      handleUpdateBalance({ token: -feed.price });
    } catch (e) {
      const error = await e;
      message.error(error.message || 'Error occured, please try again later');
    } finally {
      this.setState({ requesting: false, openPurchaseModal: false });
    }
  };

  render() {
    const {
      feed, user, commentMapping, comment, createComment: handleCreateComment, siteName
    } = this.props;
    const { performer } = feed;
    const { requesting: commenting } = comment;
    const fetchingComment = commentMapping.hasOwnProperty(feed._id) ? commentMapping[feed._id].requesting : false;
    const comments = commentMapping.hasOwnProperty(feed._id) ? commentMapping[feed._id].items : [];
    const totalComments = commentMapping.hasOwnProperty(feed._id) ? commentMapping[feed._id].total : 0;
    const {
      isLiked, totalLike, isHovered, isBought,
      openTipModal, openPurchaseModal, submiting,
      openTeaser, openSubscriptionModal, openReportModal, requesting, subscriptionType, relatedListFeeds
    } = this.state;
    let canView = (!feed.isSale && feed.isSubscribed)
    || (feed.isSale && isBought)
    || feed.type === 'text'
    || (feed.isSale && !feed.price);

    if (!user?._id || (`${user?._id}` !== `${feed?.fromSourceId}` && user?.isPerformer)) {
      canView = false;
    }
    const images = feed.files && feed.files.filter((f) => f.type === 'feed-photo');
    const videos = feed.files && feed.files.filter((f) => f.type === 'feed-video');
    const thumbUrl = (feed?.thumbnail?.thumbnails && feed?.thumbnail?.thumbnails[0])
      || (images && images[0] && images[0]?.thumbnails && images[0]?.thumbnails[0])
      || (feed?.teaser && feed?.teaser?.thumbnails && feed?.teaser?.thumbnails[0])
      || (videos && videos[0] && videos[0]?.thumbnails && videos[0]?.thumbnails[0])
      || '/static/leaf.jpg';

    return (
      <div className="feed-card-custom">
        <div className="feed-container">
          <div className="feed-text">
            <h3>
              {feed.text}
            </h3>
          </div>
          {canView && (
            <div className="feed-content">
              <FeedSlider feed={feed} />
              <div className="feed-bottom">
                <div className="action-item">
                  <span aria-hidden className={isLiked ? 'action-ico active' : 'action-ico'} onClick={this.handleLike.bind(this)}>
                    <FavoriteSvg />
                    {shortenLargeNumber(totalLike)}
                  </span>
                  {performer && (
                  <span aria-hidden className="action-ico" onClick={() => this.setState({ openTipModal: true })}>
                    <SendTipSvg />
                  </span>
                  )}
                </div>
              </div>
            </div>
          )}
          {!canView && (
            <div className="lock-content">
              {/* eslint-disable-next-line no-nested-ternary */}
              <div className="feed-bg" style={{ backgroundImage: `url(${thumbUrl})`, filter: canView && thumbUrl ? 'blur(0px)' : 'blur(15px)' }} />
              <div className="lock-middle">
                {!feed.isSale && !feed.isSubscribed && (
                  <Button
                    onMouseEnter={() => this.setState({ isHovered: true })}
                    onMouseLeave={() => this.setState({ isHovered: false })}
                    disabled={user.isPerformer}
                    className="secondary"
                    onClick={() => this.setState({ openSubscriptionModal: true })}
                  >
                    {(isHovered) ? <UnlockOutlined /> : <LockOutlined />}
                    {' '}
                    Subscribe to unlock
                  </Button>
                )}
                {feed.isSale && feed.price > 0 && !isBought && (
                  <Button
                    onMouseEnter={() => this.setState({ isHovered: true })}
                    onMouseLeave={() => this.setState({ isHovered: false })}
                    disabled={user.isPerformer}
                    className="secondary"
                    onClick={() => this.setState({ openPurchaseModal: true })}
                  >
                    {(isHovered) ? <UnlockOutlined /> : <LockOutlined />}
                    {' '}
                    Unlock for
                    {' '}
                    {(feed.price || 0).toFixed(2)}
                    $
                  </Button>
                )}
                {(feed.isSale && !feed.price && !user._id) && (
                <Button
                  onMouseEnter={() => this.setState({ isHovered: true })}
                  onMouseLeave={() => this.setState({ isHovered: false })}
                  disabled={user.isPerformer}
                  className="secondary"
                  onClick={() => Router.push({ pathname: '/model/profile', query: { username: performer?.username || performer?._id } }, `/${performer?.username || performer?._id}`)}
                >
                  Follow for free
                </Button>
                )}
                {feed.teaser && (
                  <Button className="teaser-btn" type="link" onClick={() => this.setState({ openTeaser: true })}>
                    View teaser
                  </Button>
                )}
              </div>
              {feed.files && feed.files.length > 0 && (
                <div className="count-media">
                  <span className="count-media-item">
                    {images.length > 0 && (
                      <span className="media-item">
                        <ImageFillIcon />
                        {' '}
                        {images.length}
                      </span>
                    )}
                    {videos.length > 0 && images.length > 0 && '|'}
                    {videos.length > 0 && (
                      <span className="media-item">
                        {videos.length > 1 && videos.length}
                        {' '}
                        <VideoFillIcon />
                        {' '}
                        {videos.length === 1 && videoDuration(videos[0].duration)}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* //sfsf */}

        <div className="vid-split">
          <div className="main-container">
            <div className="vid-act">
              <Link
                href={{
                  pathname: '/model/profile',
                  query: { username: feed?.performer?.username || feed?.performer?._id }
                }}
                as={`/${feed?.performer?.username || feed?.performer?._id}`}
              >
                <a>
                  <div className="o-w-ner">
                    <Avatar
                      alt="performer avatar"
                      src={feed?.performer?.avatar || '/static/no-avatar.png'}
                    />
                    <div className="owner-name">
                      <div className="name">
                        {feed?.performer?.name || 'N/A'}
                        {feed?.performer?.verifiedAccount && <TickIcon />}
                      </div>
                      <small>
                        @
                        {feed?.performer?.username || 'n/a'}
                      </small>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>

        <Tabs
          defaultActiveKey="comment"
          className="custom"
        >
          <TabPane
            tab={`Comments (${feed.totalComment})`}
            key="comment"
          >
            <CommentForm
              creator={user}
              onSubmit={handleCreateComment.bind(this)}
              objectId={feed._id}
              objectType="feed"
              requesting={commenting}
              siteName={siteName}
            />
            <ListComments
              key={`list_comments_${feed._id}_${comments.length}`}
              requesting={fetchingComment}
              comments={comments}
              total={totalComments}
              onDelete={this.deleteComment.bind(this)}
              user={user}
              canReply
            />
            {comments.length < totalComments && <p className="text-center"><a aria-hidden onClick={this.moreComment.bind(this)}>More comments...</a></p>}

          </TabPane>
        </Tabs>
        <div className="related-feed">
          <h4 className="ttl-1">You may also like</h4>
          <div className="grid-view">
            {relatedListFeeds.length > 0
                  && relatedListFeeds.map((item) => <FeedGridCard feed={item} key={item._id} />)}
          </div>
          {!relatedListFeeds.length && (
          <p>No video was found</p>
          )}
        </div>
        <Modal
          key="tip_performer"
          className="tip-modal"
          title={null}
          width={600}
          visible={openTipModal}
          onOk={() => this.setState({ openTipModal: false })}
          footer={null}
          onCancel={() => this.setState({ openTipModal: false })}
        >
          <TipPerformerForm performer={performer} submiting={requesting} onFinish={this.sendTip.bind(this)} />
        </Modal>
        <Modal
          key="purchase_post"
          className="purchase-modal"
          title={null}
          visible={openPurchaseModal}
          footer={null}
          width={600}
          destroyOnClose
          onCancel={() => this.setState({ openPurchaseModal: false })}
        >
          <PurchaseFeedForm feed={feed} submiting={requesting} onFinish={this.purchaseFeed.bind(this)} />
        </Modal>
        <Modal
          key="report_post"
          className="subscription-modal"
          title={null}
          visible={openReportModal}
          footer={null}
          destroyOnClose
          onCancel={() => this.setState({ openReportModal: false })}
        >
          <ReportForm performer={performer} submiting={requesting} onFinish={this.handleReport.bind(this)} />
        </Modal>
        <Modal
          key="subscribe_performer"
          className="subscription-modal"
          width={600}
          centered
          title={null}
          visible={openSubscriptionModal}
          footer={null}
          destroyOnClose
          onCancel={() => this.setState({ openSubscriptionModal: false, subscriptionType: '' })}
        >
          {!subscriptionType ? (
            <div
              className="subscription-btn-grp"
            >
              <h2 style={{ paddingTop: 25 }}>SUBSCRIBE TO UNLOCK</h2>
              {/* {feed?.performer?.isFreeSubscription && (
              <Button
                className="primary"
                disabled={!user || !user._id || (submiting && subscriptionType === 'free')}
                onClick={() => {
                  this.setState({ openSubscriptionModal: true, subscriptionType: 'free' });
                }}
              >
                SUBSCRIBE FOR FREE FOR
                {' '}
                {feed?.performer?.durationFreeSubscriptionDays || 1}
                {' '}
                {feed?.performer?.durationFreeSubscriptionDays > 1 ? 'DAYS' : 'DAY'}
              </Button>
              )} */}
              {feed?.performer?.monthlyPrice && (
              <Button
                className="primary"
                disabled={!user || !user._id || (submiting && subscriptionType === 'monthly')}
                onClick={() => {
                  this.setState({ openSubscriptionModal: true, subscriptionType: 'monthly' });
                }}
              >
                MONTHLY SUBSCRIPTION FOR $
                {(feed?.performer?.monthlyPrice || 0).toFixed(2)}
              </Button>
              )}
              {feed?.performer.yearlyPrice && (
              <Button
                className="primary"
                disabled={!user || !user._id || (submiting && subscriptionType === 'yearly')}
                onClick={() => {
                  this.setState({ openSubscriptionModal: true, subscriptionType: 'yearly' });
                }}
              >
                YEARLY SUBSCRIPTON FOR $
                {(feed?.performer?.yearlyPrice || 0).toFixed(2)}
              </Button>
              )}
            </div>
          ) : (
            <ConfirmSubscriptionPerformerForm
              type={subscriptionType}
              performer={performer}
              submiting={submiting}
              onFinish={this.subscribe.bind(this)}
            />
          )}
        </Modal>
        <Modal
          key="teaser_video"
          title="Teaser video"
          visible={openTeaser}
          footer={null}
          onCancel={() => this.setState({ openTeaser: false })}
          width={650}
          destroyOnClose
          className="modal-teaser-preview"
        >
          <VideoPlayer
            key={feed?.teaser?._id}
            {...{
              autoplay: true,
              controls: true,
              playsinline: true,
              fluid: true,
              sources: [
                {
                  src: feed?.teaser?.url,
                  type: 'video/mp4'
                }
              ]
            }}
          />
        </Modal>
        {submiting && <Loader customText="We are processing your payment, please do not reload this page until it's done." />}
      </div>
    );
  }
}

const mapStates = (state: any) => {
  const { commentMapping, comment } = state.comment;
  return {
    siteName: state.ui.siteName,
    user: state.user.current,
    commentMapping,
    comment,
    settings: state.settings
  };
};

const mapDispatch = {
  getComments, moreComment, createComment, deleteComment, updateBalance
};
export default connect(mapStates, mapDispatch)(FeedCardCustom);
