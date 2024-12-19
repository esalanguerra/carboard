import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

export default function Page() {
  const [car, setCar] = useState({});

  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    if (id) {
      apiRequest({ data: {}, method: "GET", url: "/messages/" + id }).then(
        (data) => {
          if (data) {
            setCar(data);
          } else {
            console.log("Error", data);
          }
        }
      );
    }
  }, [id]);

  return (
    <div className="chat-main-row">
      <div className="chat-main-wrapper">
        <div className="col-lg-9 message-view task-view">
          <div className="chat-window">
            <div className="fixed-header">
              <div className="navbar">
                <div className="user-details mr-auto">
                  <div className="user-info float-left">
                    <a href="profile.html" title="Mike Litorus">
                      <span>{car.seller}</span>{" "}
                    </a>
                  </div>
                </div>
                <div className="search-box">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      placeholder="Search"
                      className="form-control"
                    />
                    <span className="input-group-append">
                      <button type="button" className="btn">
                        <i className="fa fa-search"></i>
                      </button>
                    </span>
                  </div>
                </div>
                <ul className="nav custom-menu">
                  <li className="nav-item">
                    <a
                      className="nav-link task-chat profile-rightbar float-right"
                      id="task_chat"
                      href="#task_window"
                    >
                      <i className="fa fa-user"></i>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="voice-call.html" className="nav-link">
                      <i className="fa fa-phone"></i>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="video-call.html" className="nav-link">
                      <i className="fa fa-video-camera"></i>
                    </a>
                  </li>
                  <li className="nav-item dropdown dropdown-action">
                    <a
                      aria-expanded="false"
                      data-toggle="dropdown"
                      className="nav-link dropdown-toggle"
                      href=""
                    >
                      <i className="fa fa-cog"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a href="javascript:void(0)" className="dropdown-item">
                        Delete Conversations
                      </a>
                      <a href="javascript:void(0)" className="dropdown-item">
                        Settings
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="chat-contents">
              <div className="chat-content-wrap">
                <div className="chat-wrap-inner">
                  <div className="chat-box">
                    <div className="chats">
                      <div className="chat chat-right">
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>Hello. What can I do for you?</p>
                              <span className="chat-time">8:30 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat-line">
                        <span className="chat-date">October 8th, 2018</span>
                      </div>
                      <div className="chat chat-left">
                        <div className="chat-avatar">
                          <a href="profile.html" className="avatar">
                            <img
                              alt=""
                              src="assets/img/profiles/avatar-05.jpg"
                            />
                          </a>
                        </div>
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>I'm just looking around.</p>
                              <p>Will you tell me something about yourself? </p>
                              <span className="chat-time">8:35 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>Are you there? That time!</p>
                              <span className="chat-time">8:40 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat chat-right">
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>Where?</p>
                              <span className="chat-time">8:35 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>
                                OK, my name is Limingqiang. I like singing,
                                playing basketballand so on.
                              </p>
                              <span className="chat-time">8:42 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat chat-left">
                        <div className="chat-avatar">
                          <a href="profile.html" className="avatar">
                            <img
                              alt=""
                              src="assets/img/profiles/avatar-05.jpg"
                            />
                          </a>
                        </div>
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>You wait for notice.</p>
                              <span className="chat-time">8:30 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>Consectetuorem ipsum dolor sit?</p>
                              <span className="chat-time">8:50 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>OK?</p>
                              <span className="chat-time">8:55 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="chat-bubble">
                            <div className="chat-content img-content">
                              <div className="chat-img-group clearfix">
                                <p>Uploaded 3 Images</p>
                                <a className="chat-img-attach" href="#">
                                  <img
                                    width="182"
                                    height="137"
                                    alt=""
                                    src="assets/img/placeholder.jpg"
                                  />
                                  <div className="chat-placeholder">
                                    <div className="chat-img-name">
                                      placeholder.jpg
                                    </div>
                                    <div className="chat-file-desc">842 KB</div>
                                  </div>
                                </a>
                                <a className="chat-img-attach" href="#">
                                  <img
                                    width="182"
                                    height="137"
                                    alt=""
                                    src="assets/img/placeholder.jpg"
                                  />
                                  <div className="chat-placeholder">
                                    <div className="chat-img-name">842 KB</div>
                                  </div>
                                </a>
                                <a className="chat-img-attach" href="#">
                                  <img
                                    width="182"
                                    height="137"
                                    alt=""
                                    src="assets/img/placeholder.jpg"
                                  />
                                  <div className="chat-placeholder">
                                    <div className="chat-img-name">
                                      placeholder.jpg
                                    </div>
                                    <div className="chat-file-desc">842 KB</div>
                                  </div>
                                </a>
                              </div>
                              <span className="chat-time">9:00 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat chat-right">
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>OK!</p>
                              <span className="chat-time">9:00 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat chat-left">
                        <div className="chat-avatar">
                          <a href="profile.html" className="avatar">
                            <img
                              alt=""
                              src="assets/img/profiles/avatar-05.jpg"
                            />
                          </a>
                        </div>
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>Uploaded 3 files</p>
                              <ul className="attach-list">
                                <li>
                                  <i className="fa fa-file"></i>{" "}
                                  <a href="#">example.avi</a>
                                </li>
                                <li>
                                  <i className="fa fa-file"></i>{" "}
                                  <a href="#">activity.psd</a>
                                </li>
                                <li>
                                  <i className="fa fa-file"></i>{" "}
                                  <a href="#">example.psd</a>
                                </li>
                              </ul>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>Consectetuorem ipsum dolor sit?</p>
                              <span className="chat-time">8:50 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>OK?</p>
                              <span className="chat-time">8:55 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat chat-right">
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content img-content">
                              <div className="chat-img-group clearfix">
                                <p>Uploaded 6 Images</p>
                                <a className="chat-img-attach" href="#">
                                  <img
                                    width="182"
                                    height="137"
                                    alt=""
                                    src="assets/img/placeholder.jpg"
                                  />
                                  <div className="chat-placeholder">
                                    <div className="chat-img-name">
                                      placeholder.jpg
                                    </div>
                                    <div className="chat-file-desc">842 KB</div>
                                  </div>
                                </a>
                                <a className="chat-img-attach" href="#">
                                  <img
                                    width="182"
                                    height="137"
                                    alt=""
                                    src="assets/img/placeholder.jpg"
                                  />
                                  <div className="chat-placeholder">
                                    <div className="chat-img-name">842 KB</div>
                                  </div>
                                </a>
                                <a className="chat-img-attach" href="#">
                                  <img
                                    width="182"
                                    height="137"
                                    alt=""
                                    src="assets/img/placeholder.jpg"
                                  />
                                  <div className="chat-placeholder">
                                    <div className="chat-img-name">
                                      placeholder.jpg
                                    </div>
                                    <div className="chat-file-desc">842 KB</div>
                                  </div>
                                </a>
                                <a className="chat-img-attach" href="#">
                                  <img
                                    width="182"
                                    height="137"
                                    alt=""
                                    src="assets/img/placeholder.jpg"
                                  />
                                  <div className="chat-placeholder">
                                    <div className="chat-img-name">
                                      placeholder.jpg
                                    </div>
                                    <div className="chat-file-desc">842 KB</div>
                                  </div>
                                </a>
                                <a className="chat-img-attach" href="#">
                                  <img
                                    width="182"
                                    height="137"
                                    alt=""
                                    src="assets/img/placeholder.jpg"
                                  />
                                  <div className="chat-placeholder">
                                    <div className="chat-img-name">
                                      placeholder.jpg
                                    </div>
                                    <div className="chat-file-desc">842 KB</div>
                                  </div>
                                </a>
                                <a className="chat-img-attach" href="#">
                                  <img
                                    width="182"
                                    height="137"
                                    alt=""
                                    src="assets/img/placeholder.jpg"
                                  />
                                  <div className="chat-placeholder">
                                    <div className="chat-img-name">
                                      placeholder.jpg
                                    </div>
                                    <div className="chat-file-desc">842 KB</div>
                                  </div>
                                </a>
                              </div>
                              <span className="chat-time">9:00 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat chat-left">
                        <div className="chat-avatar">
                          <a href="profile.html" className="avatar">
                            <img
                              alt=""
                              src="assets/img/profiles/avatar-05.jpg"
                            />
                          </a>
                        </div>
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <ul className="attach-list">
                                <li className="pdf-file">
                                  <i className="fa fa-file-pdf-o"></i>{" "}
                                  <a href="#">Document_2016.pdf</a>
                                </li>
                              </ul>
                              <span className="chat-time">9:00 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat chat-right">
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <ul className="attach-list">
                                <li className="pdf-file">
                                  <i className="fa fa-file-pdf-o"></i>{" "}
                                  <a href="#">Document_2016.pdf</a>
                                </li>
                              </ul>
                              <span className="chat-time">9:00 am</span>
                            </div>
                            <div className="chat-action-btns">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="share-msg"
                                    title="Share"
                                  >
                                    <i className="fa fa-share-alt"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="edit-msg">
                                    <i className="fa fa-pencil"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="del-msg">
                                    <i className="fa fa-trash-o"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat chat-left">
                        <div className="chat-avatar">
                          <a href="profile.html" className="avatar">
                            <img
                              alt=""
                              src="assets/img/profiles/avatar-05.jpg"
                            />
                          </a>
                        </div>
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <p>Typing ...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="chat-footer">
              <div className="message-bar">
                <div className="message-inner">
                  <a
                    className="link attach-icon"
                    href="#"
                    data-toggle="modal"
                    data-target="#drag_files"
                  >
                    <img src="assets/img/attachment.png" alt="" />
                  </a>
                  <div className="message-area">
                    <div className="input-group">
                      <textarea
                        className="form-control"
                        placeholder="Type message..."
                      ></textarea>
                      <span className="input-group-append">
                        <button className="btn btn-custom" type="button">
                          <i className="fa fa-send"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-lg-3 message-view chat-profile-view chat-sidebar"
          id="task_window"
        >
          <div className="chat-window video-window">
            <div className="fixed-header">
              <ul className="nav nav-tabs nav-tabs-bottom">
                <li className="nav-item">
                  <a className="nav-link" href="#calls_tab" data-toggle="tab">
                    Calls
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    href="#profile_tab"
                    data-toggle="tab"
                  >
                    Profile
                  </a>
                </li>
              </ul>
            </div>
            <div className="tab-content chat-contents">
              <div className="content-full tab-pane" id="calls_tab">
                <div className="chat-wrap-inner">
                  <div className="chat-box">
                    <div className="chats">
                      <div className="chat chat-left">
                        <div className="chat-avatar">
                          <a href="profile.html" className="avatar">
                            <img
                              alt=""
                              src="assets/img/profiles/avatar-02.jpg"
                            />
                          </a>
                        </div>
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <span className="task-chat-user">You</span>{" "}
                              <span className="chat-time">8:35 am</span>
                              <div className="call-details">
                                <i className="material-icons">phone_missed</i>
                                <div className="call-info">
                                  <div className="call-user-details">
                                    <span className="call-description">
                                      Jeffrey Warden missed the call
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat chat-left">
                        <div className="chat-avatar">
                          <a href="profile.html" className="avatar">
                            <img
                              alt=""
                              src="assets/img/profiles/avatar-02.jpg"
                            />
                          </a>
                        </div>
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <span className="task-chat-user">John Doe</span>{" "}
                              <span className="chat-time">8:35 am</span>
                              <div className="call-details">
                                <i className="material-icons">call_end</i>
                                <div className="call-info">
                                  <div className="call-user-details">
                                    <span className="call-description">
                                      This call has ended
                                    </span>
                                  </div>
                                  <div className="call-timing">
                                    Duration: <strong>5 min 57 sec</strong>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat-line">
                        <span className="chat-date">January 29th, 2019</span>
                      </div>
                      <div className="chat chat-left">
                        <div className="chat-avatar">
                          <a href="profile.html" className="avatar">
                            <img
                              alt=""
                              src="assets/img/profiles/avatar-05.jpg"
                            />
                          </a>
                        </div>
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <span className="task-chat-user">
                                Richard Miles
                              </span>{" "}
                              <span className="chat-time">8:35 am</span>
                              <div className="call-details">
                                <i className="material-icons">phone_missed</i>
                                <div className="call-info">
                                  <div className="call-user-details">
                                    <span className="call-description">
                                      You missed the call
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat chat-left">
                        <div className="chat-avatar">
                          <a href="profile.html" className="avatar">
                            <img
                              alt=""
                              src="assets/img/profiles/avatar-02.jpg"
                            />
                          </a>
                        </div>
                        <div className="chat-body">
                          <div className="chat-bubble">
                            <div className="chat-content">
                              <span className="task-chat-user">You</span>{" "}
                              <span className="chat-time">8:35 am</span>
                              <div className="call-details">
                                <i className="material-icons">ring_volume</i>
                                <div className="call-info">
                                  <div className="call-user-details">
                                    <a
                                      href="#"
                                      className="call-description call-description--linked"
                                      data-qa="call_attachment_link"
                                    >
                                      Calling John Smith ...
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="content-full tab-pane show active"
                id="profile_tab"
              >
                <div className="display-table">
                  <div className="table-row">
                    <div className="table-body">
                      <div className="table-content">
                        <div className="chat-profile-img">
                          <div className="edit-profile-img">
                            <img
                              src="assets/img/profiles/avatar-02.jpg"
                              alt=""
                            />
                            <span className="change-img">Change Image</span>
                          </div>
                          <h3 className="user-name m-t-10 mb-0">John Doe</h3>
                          <small className="text-muted">Web Designer</small>
                          <a
                            href="javascript:void(0);"
                            className="btn btn-primary edit-btn"
                          >
                            <i className="fa fa-pencil"></i>
                          </a>
                        </div>
                        <div className="chat-profile-info">
                          <ul className="user-det-list">
                            <li>
                              <span>Username:</span>
                              <span className="float-right text-muted">
                                johndoe
                              </span>
                            </li>
                            <li>
                              <span>DOB:</span>
                              <span className="float-right text-muted">
                                24 July
                              </span>
                            </li>
                            <li>
                              <span>Email:</span>
                              <span className="float-right text-muted">
                                johndoe@example.com
                              </span>
                            </li>
                            <li>
                              <span>Phone:</span>
                              <span className="float-right text-muted">
                                9876543210
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="transfer-files">
                          <ul className="nav nav-tabs nav-tabs-solid nav-justified mb-0">
                            <li className="nav-item">
                              <a
                                className="nav-link active"
                                href="#all_files"
                                data-toggle="tab"
                              >
                                All Files
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                className="nav-link"
                                href="#my_files"
                                data-toggle="tab"
                              >
                                My Files
                              </a>
                            </li>
                          </ul>
                          <div className="tab-content">
                            <div
                              className="tab-pane show active"
                              id="all_files"
                            >
                              <ul className="files-list">
                                <li>
                                  <div className="files-cont">
                                    <div className="file-type">
                                      <span className="files-icon">
                                        <i className="fa fa-file-pdf-o"></i>
                                      </span>
                                    </div>
                                    <div className="files-info">
                                      <span className="file-name text-ellipsis">
                                        AHA Selfcare Mobile Application
                                        Test-Cases.xls
                                      </span>
                                      <span className="file-author">
                                        <a href="#">Loren Gatlin</a>
                                      </span>{" "}
                                      <span className="file-date">
                                        May 31st at 6:53 PM
                                      </span>
                                    </div>
                                    <ul className="files-action">
                                      <li className="dropdown dropdown-action">
                                        <a
                                          href=""
                                          className="dropdown-toggle"
                                          data-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_horiz
                                          </i>
                                        </a>
                                        <div className="dropdown-menu">
                                          <a
                                            className="dropdown-item"
                                            href="javascript:void(0)"
                                          >
                                            Download
                                          </a>
                                          <a
                                            className="dropdown-item"
                                            href="#"
                                            data-toggle="modal"
                                            data-target="#share_files"
                                          >
                                            Share
                                          </a>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="tab-pane" id="my_files">
                              <ul className="files-list">
                                <li>
                                  <div className="files-cont">
                                    <div className="file-type">
                                      <span className="files-icon">
                                        <i className="fa fa-file-pdf-o"></i>
                                      </span>
                                    </div>
                                    <div className="files-info">
                                      <span className="file-name text-ellipsis">
                                        AHA Selfcare Mobile Application
                                        Test-Cases.xls
                                      </span>
                                      <span className="file-author">
                                        <a href="#">John Doe</a>
                                      </span>{" "}
                                      <span className="file-date">
                                        May 31st at 6:53 PM
                                      </span>
                                    </div>
                                    <ul className="files-action">
                                      <li className="dropdown dropdown-action">
                                        <a
                                          href=""
                                          className="dropdown-toggle"
                                          data-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_horiz
                                          </i>
                                        </a>
                                        <div className="dropdown-menu">
                                          <a
                                            className="dropdown-item"
                                            href="javascript:void(0)"
                                          >
                                            Download
                                          </a>
                                          <a
                                            className="dropdown-item"
                                            href="#"
                                            data-toggle="modal"
                                            data-target="#share_files"
                                          >
                                            Share
                                          </a>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
